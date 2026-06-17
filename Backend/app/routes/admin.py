from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserRole, Company, Job, JobStatus, User
from app.routes.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


def serialize_company(company: Company):
    return {
        "id": company.id,
        "company_name": company.company_name,
        "address": company.address,
        "description": company.description,
        "is_validated": company.is_validated,
        "owner_name": company.user.full_name if company.user else "-",
        "owner_email": company.user.email if company.user else "-",
        "created_at": company.user.created_at.isoformat() if company.user and company.user.created_at else None,
    }


def serialize_job(job: Job):
    return {
        "id": job.id,
        "job_title": job.job_title,
        "job_description": job.job_description,
        "company_name": job.company.company_name if job.company else "-",
        "company_id": job.company_id,
        "location": job.location,
        "job_type": job.job_type,
        "status": job.status.value if hasattr(job.status, "value") else str(job.status),
        "is_validated": job.is_validated,
        "created_at": job.created_at.isoformat() if job.created_at else None,
    }


def serialize_user(user: User):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role.value if hasattr(user.role, "value") else str(user.role),
        "is_verified": user.is_verified,
        "is_locked": user.is_locked,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.get("/companies/pending")
def pending_companies(db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    companies = db.query(Company).filter(Company.is_validated == False).all()
    return [serialize_company(c) for c in companies]


@router.patch("/companies/{company_id}/validate")
def validate_company(company_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Perusahaan tidak ditemukan")
    company.is_validated = True
    company.user.is_verified = True
    db.commit()
    return {"message": "Perusahaan berhasil divalidasi", "company": serialize_company(company)}


@router.patch("/companies/{company_id}/reject")
def reject_company(company_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Perusahaan tidak ditemukan")
    if company.is_validated:
        raise HTTPException(status_code=400, detail="Perusahaan sudah divalidasi, tidak dapat ditolak")
    
    # Lock user account
    company.user.is_locked = True
    db.delete(company)
    db.commit()
    return {"message": "Perusahaan ditolak dan akun dikunci"}


@router.get("/jobs/pending")
def pending_jobs(db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    jobs = db.query(Job).filter(Job.is_validated == False).all()
    return [serialize_job(j) for j in jobs]


@router.patch("/jobs/{job_id}/validate")
def validate_job(job_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Lowongan tidak ditemukan")
    job.is_validated = True
    job.status = JobStatus.published
    db.commit()
    return {"message": "Lowongan berhasil divalidasi dan dipublish", "job": serialize_job(job)}


@router.patch("/jobs/{job_id}/reject")
def reject_job(job_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Lowongan tidak ditemukan")
    if job.is_validated:
        raise HTTPException(status_code=400, detail="Lowongan sudah divalidasi, tidak dapat ditolak")
    
    db.delete(job)
    db.commit()
    return {"message": "Lowongan ditolak dan dihapus"}


@router.get("/users")
def list_users(db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    users = db.query(User).all()
    return [serialize_user(u) for u in users]


@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return serialize_user(user)


@router.patch("/users/{user_id}/lock")
def lock_user(user_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    if user.role == UserRole.admin:
        raise HTTPException(status_code=400, detail="Tidak dapat mengunci akun admin")
    user.is_locked = True
    db.commit()
    return {"message": "Akun user berhasil dikunci", "user": serialize_user(user)}


@router.patch("/users/{user_id}/unlock")
def unlock_user(user_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    user.is_locked = False
    db.commit()
    return {"message": "Akun user berhasil dibuka", "user": serialize_user(user)}


@router.patch("/users/{user_id}/verify")
def verify_user(user_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    user.is_verified = True
    db.commit()
    return {"message": "Akun user berhasil diverifikasi", "user": serialize_user(user)}
