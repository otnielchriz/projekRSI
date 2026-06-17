from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserRole, UserSkill, Project, ProjectSkill, Certificate, SoftSkill, CV
from app.schemas import UserSkillCreate, ProjectCreate, CertificateCreate, SoftSkillCreate
from app.routes.dependencies import require_role
import os

router = APIRouter(prefix="/profile", tags=["Profil Pelamar"])
import tempfile
# Gunakan direktori temporary agar bisa berjalan di Vercel (read-only file system)
UPLOAD_DIR = os.path.join(tempfile.gettempdir(), "uploads", "cv")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def serialize_user_skill(item: UserSkill):
    return {"id": item.id, "skill_id": item.skill_id, "skill_name": item.skill.skill_name if item.skill else "-", "level": item.level}


def serialize_project(item: Project):
    return {
        "id": item.id,
        "project_name": item.project_name,
        "description": item.description,
        "link": item.link,
        "skill_ids": [ps.skill_id for ps in item.project_skills],
    }


def serialize_certificate(item: Certificate):
    return {
        "id": item.id,
        "certificate_name": item.certificate_name,
        "issuer": item.issuer,
        "issue_date": item.issue_date,
        "skill_id": item.skill_id,
        "skill_name": item.skill.skill_name if item.skill else None,
    }


def serialize_soft_skill(item: SoftSkill):
    return {"id": item.id, "soft_skill_name": item.soft_skill_name, "rating": item.rating}


@router.get("/overview")
def profile_overview(db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    applications = []
    for app in user.applications:
        applications.append({
            "id": app.id,
            "job_id": app.job_id,
            "job_title": app.job.job_title if app.job else "-",
            "company_name": app.job.company.company_name if app.job and app.job.company else "-",
            "status": app.status.value if hasattr(app.status, "value") else str(app.status),
            "matching_score": app.matching_score,
            "applied_at": app.applied_at.isoformat() if app.applied_at else None,
        })
    return {
        "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role.value},
        "skills": [serialize_user_skill(s) for s in user.skills],
        "projects": [serialize_project(p) for p in user.projects],
        "certificates": [serialize_certificate(c) for c in user.certificates],
        "soft_skills": [serialize_soft_skill(s) for s in user.soft_skills],
        "cv": {"file_path": user.cv.file_path, "uploaded_at": user.cv.uploaded_at.isoformat()} if user.cv else None,
        "applications": applications,
    }


@router.get("/skills")
def my_skills(db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    return [serialize_user_skill(item) for item in user.skills]


@router.post("/skills")
def add_user_skill(payload: UserSkillCreate, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    total = db.query(UserSkill).filter(UserSkill.user_id == user.id).count()
    if total >= 10:
        raise HTTPException(status_code=400, detail="ERR-BUS-01: Hard skill maksimal 10")

    exists = db.query(UserSkill).filter(UserSkill.user_id == user.id, UserSkill.skill_id == payload.skill_id).first()
    if exists:
        raise HTTPException(status_code=400, detail="Skill sudah ada di profil")

    item = UserSkill(user_id=user.id, skill_id=payload.skill_id, level=payload.level)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Hard skill berhasil ditambahkan", "skill": serialize_user_skill(item)}


@router.delete("/skills/{user_skill_id}")
def delete_user_skill(user_skill_id: int, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    item = db.query(UserSkill).filter(UserSkill.id == user_skill_id, UserSkill.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill profil tidak ditemukan")
    db.delete(item)
    db.commit()
    return {"message": "Hard skill berhasil dihapus"}


@router.get("/projects")
def my_projects(user: User = Depends(require_role(UserRole.user))):
    return [serialize_project(item) for item in user.projects]


@router.post("/projects")
def add_project(payload: ProjectCreate, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    total = db.query(Project).filter(Project.user_id == user.id).count()
    if total >= 10:
        raise HTTPException(status_code=400, detail="ERR-BUS-03: Project maksimal 10")
    if not payload.skill_ids:
        raise HTTPException(status_code=400, detail="Project wajib menautkan minimal 1 skill")

    project = Project(user_id=user.id, project_name=payload.project_name, description=payload.description, link=payload.link)
    db.add(project)
    db.commit()
    db.refresh(project)

    for skill_id in payload.skill_ids:
        db.add(ProjectSkill(project_id=project.id, skill_id=skill_id))
    db.commit()
    db.refresh(project)
    return {"message": "Project berhasil ditambahkan", "project": serialize_project(project)}


@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project tidak ditemukan")
    db.delete(project)
    db.commit()
    return {"message": "Project berhasil dihapus"}


@router.get("/certificates")
def my_certificates(user: User = Depends(require_role(UserRole.user))):
    return [serialize_certificate(item) for item in user.certificates]


@router.post("/certificates")
def add_certificate(payload: CertificateCreate, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    total = db.query(Certificate).filter(Certificate.user_id == user.id).count()
    if total >= 5:
        raise HTTPException(status_code=400, detail="ERR-BUS-04: Sertifikat maksimal 5")

    cert = Certificate(user_id=user.id, **payload.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return {"message": "Sertifikat berhasil ditambahkan", "certificate": serialize_certificate(cert)}


@router.delete("/certificates/{certificate_id}")
def delete_certificate(certificate_id: int, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    cert = db.query(Certificate).filter(Certificate.id == certificate_id, Certificate.user_id == user.id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Sertifikat tidak ditemukan")
    db.delete(cert)
    db.commit()
    return {"message": "Sertifikat berhasil dihapus"}


@router.post("/soft-skills")
def add_soft_skill(payload: SoftSkillCreate, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    item = SoftSkill(user_id=user.id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Soft skill berhasil ditambahkan", "soft_skill": serialize_soft_skill(item)}


@router.post("/cv")
def upload_cv(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.user))):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="ERR-VAL-08: CV wajib PDF")

    content = file.file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="ERR-VAL-09: Ukuran CV maksimal 5MB")

    local_path = os.path.join(UPLOAD_DIR, f"user_{user.id}_{file.filename}")
    with open(local_path, "wb") as f:
        f.write(content)

    public_path = f"/uploads/cv/user_{user.id}_{file.filename}"
    existing = db.query(CV).filter(CV.user_id == user.id).first()
    if existing:
        existing.file_path = public_path
    else:
        db.add(CV(user_id=user.id, file_path=public_path))
    db.commit()
    return {"message": "CV berhasil diupload", "file_path": public_path}
