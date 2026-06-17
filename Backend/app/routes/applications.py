from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import User, UserRole, Application, Job, JobStatus, UserSkill, Company, Certificate, Project
from app.schemas.schemas import JobApplicantDetailResponse
from app.routes.dependencies import require_role
from app.services.scoring_service import calculate_matching_score

router = APIRouter(prefix="/applications", tags=["Lamaran dan Scoring"])


def serialize_application(app: Application):
    return {
        "id": app.id,
        "user_id": app.user_id,
        "job_id": app.job_id,
        "status": app.status.value if hasattr(app.status, "value") else str(app.status),
        "matching_score": app.matching_score,
        "applied_at": app.applied_at.isoformat() if app.applied_at else None,
        "applicant_name": app.user.full_name if app.user else "-",
        "applicant_email": app.user.email if app.user else "-",
        "job_title": app.job.job_title if app.job else "-",
        "company_name": app.job.company.company_name if app.job and app.job.company else "-",
        "skills": [
            {"skill_name": s.skill.skill_name if s.skill else "-", "level": s.level}
            for s in app.user.skills
        ] if app.user else [],
    }


def serialize_application_detail(app: Application):
    """Serialize application with full applicant profile details"""
    user = app.user
    cv_path = user.cv.file_path if user and user.cv else None
    cv_message = None if cv_path else "Pelamar belum mengupload CV"
    
    return {
        "id": app.id,
        "user_id": app.user_id,
        "job_id": app.job_id,
        "status": app.status.value if hasattr(app.status, "value") else str(app.status),
        "matching_score": app.matching_score,
        "applied_at": app.applied_at.isoformat() if app.applied_at else None,
        "applicant_name": user.full_name if user else "-",
        "applicant_email": user.email if user else "-",
        "cv_path": cv_path,
        "cv_message": cv_message,
        "skills": [
            {"skill_name": s.skill.skill_name if s.skill else "-", "level": s.level}
            for s in user.skills
        ] if user else [],
        "projects": [
            {
                "project_name": p.project_name,
                "description": p.description,
                "link": p.link
            }
            for p in user.projects
        ] if user else [],
        "certificates": [
            {
                "certificate_name": c.certificate_name,
                "issuer": c.issuer,
                "issue_date": c.issue_date,
                "skill_name": c.skill.skill_name if c.skill else None
            }
            for c in user.certificates
        ] if user else [],
    }


@router.post("/apply/{job_id}")
def apply_job(job_id: int, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job or job.status != JobStatus.published or not job.is_validated:
        raise HTTPException(status_code=400, detail="ERR-BUS-07: Lowongan tidak aktif atau belum divalidasi")

    if job.expired_date and job.expired_date < datetime.utcnow():
        raise HTTPException(status_code=400, detail="ERR-BUS-07: Lowongan sudah ditutup")

    if db.query(Application).filter(Application.user_id == user.id, Application.job_id == job_id).first():
        raise HTTPException(status_code=400, detail="ERR-BUS-06: User sudah pernah melamar lowongan ini")

    if db.query(UserSkill).filter(UserSkill.user_id == user.id).count() < 1:
        raise HTTPException(status_code=400, detail="ERR-BUS-08: Profil kompetensi kosong. Tambahkan minimal 1 hard skill dulu.")

    score = calculate_matching_score(db, user.id, job_id)
    application = Application(user_id=user.id, job_id=job_id, matching_score=score)
    db.add(application)
    db.commit()
    db.refresh(application)
    return {"message": "Lamaran berhasil dikirim", "matching_score": score, "application": serialize_application(application)}


@router.get("/my")
def my_applications(db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    apps = db.query(Application).filter(Application.user_id == user.id).order_by(Application.applied_at.desc()).all()
    return [serialize_application(app) for app in apps]


@router.get("/job/{job_id}/candidates")
def ranked_candidates(job_id: int, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.company))):
    company = db.query(Company).filter(Company.user_id == user.id).first()
    job = db.query(Job).filter(Job.id == job_id, Job.company_id == company.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Lowongan tidak ditemukan")
    apps = db.query(Application).filter(Application.job_id == job_id).order_by(Application.matching_score.desc()).all()
    return [serialize_application(app) for app in apps]


@router.get("/{application_id}/detail", response_model=JobApplicantDetailResponse)
def get_application_detail(application_id: int, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.company))):
    app = (
        db.query(Application)
        .options(
            joinedload(Application.job),
            joinedload(Application.user).options(
                joinedload(User.cv),
                joinedload(User.skills).joinedload(UserSkill.skill),
                joinedload(User.projects),
                joinedload(User.certificates).joinedload(Certificate.skill),
            )
        )
        .filter(Application.id == application_id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Lamaran tidak ditemukan")
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if app.job.company_id != company.id:
        raise HTTPException(status_code=403, detail="Akses ditolak")
    return serialize_application_detail(app)


@router.patch("/{application_id}/status")
def update_application_status(application_id: int, status: str, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.company))):
    if status not in ["accepted", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Status tidak valid")
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Lamaran tidak ditemukan")
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if app.job.company_id != company.id:
        raise HTTPException(status_code=403, detail="Akses ditolak")
    app.status = status
    db.commit()
    db.refresh(app)
    return {"message": "Status lamaran berhasil diperbarui", "application": serialize_application(app)}
