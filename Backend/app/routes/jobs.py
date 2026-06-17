from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import User, UserRole, Company, Job, JobRequiredSkill, JobStatus
from app.schemas import JobCreate
from app.routes.dependencies import require_role

router = APIRouter(prefix="/jobs", tags=["Lowongan"])


def serialize_job(job: Job):
    return {
        "id": job.id,
        "company_id": job.company_id,
        "company_name": job.company.company_name if job.company else "-",
        "job_title": job.job_title,
        "job_description": job.job_description,
        "job_qualification": job.job_qualification,
        "location": job.location,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "job_type": job.job_type,
        "status": job.status.value if hasattr(job.status, "value") else str(job.status),
        "expired_date": job.expired_date.isoformat() if job.expired_date else None,
        "is_validated": job.is_validated,
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "required_skills": [
            {
                "id": rs.id,
                "skill_id": rs.skill_id,
                "skill_name": rs.skill.skill_name if rs.skill else "-",
                "minimum_level": rs.minimum_level,
            }
            for rs in job.required_skills
        ],
        "total_applicants": len(job.applications),
    }


@router.get("")
def list_published_jobs(
    keyword: Optional[str] = Query(default=None),
    location: Optional[str] = Query(default=None),
    job_type: Optional[str] = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Job)
        .options(
            joinedload(Job.company),
            joinedload(Job.required_skills).joinedload(JobRequiredSkill.skill),
            joinedload(Job.applications),
        )
        .filter(
            Job.status == JobStatus.published,
            Job.is_validated == True,
        )
    )

    if keyword and keyword.strip():
        search = f"%{keyword.strip()}%"
        query = query.filter(
            or_(
                Job.job_title.ilike(search),
                Job.job_description.ilike(search),
                Job.job_qualification.ilike(search),
                Company.company_name.ilike(search),
            )
        ).join(Company, Job.company_id == Company.id)

    if location and location.strip():
        query = query.filter(Job.location.ilike(f"%{location.strip()}%"))

    if job_type and job_type.strip():
        query = query.filter(Job.job_type.ilike(f"%{job_type.strip()}%"))

    jobs = query.order_by(Job.created_at.desc()).limit(limit).all()
    return [serialize_job(job) for job in jobs]


@router.get("/recommended")
def recommended_jobs(
    limit: int = Query(default=6, ge=1, le=20),
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.user)),
):
    user_skill_ids = [skill.skill_id for skill in user.skills]

    query = (
        db.query(Job)
        .options(
            joinedload(Job.company),
            joinedload(Job.required_skills).joinedload(JobRequiredSkill.skill),
            joinedload(Job.applications),
        )
        .filter(
            Job.status == JobStatus.published,
            Job.is_validated == True,
        )
    )

    jobs = query.order_by(Job.created_at.desc()).all()

    if user_skill_ids:
        jobs = sorted(
            jobs,
            key=lambda job: len(
                set(user_skill_ids)
                & set(required.skill_id for required in job.required_skills)
            ),
            reverse=True,
        )

    return [serialize_job(job) for job in jobs[:limit]]


@router.get("/company/my")
def my_company_jobs(
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.company)),
):
    company = db.query(Company).filter(Company.user_id == user.id).first()

    if not company:
        raise HTTPException(status_code=404, detail="Data perusahaan tidak ditemukan")

    jobs = (
        db.query(Job)
        .options(
            joinedload(Job.company),
            joinedload(Job.required_skills).joinedload(JobRequiredSkill.skill),
            joinedload(Job.applications),
        )
        .filter(Job.company_id == company.id)
        .order_by(Job.created_at.desc())
        .all()
    )

    return {
        "company": {
            "id": company.id,
            "company_name": company.company_name,
            "address": company.address,
            "description": company.description,
            "is_validated": company.is_validated,
        },
        "jobs": [serialize_job(job) for job in jobs],
    }


@router.get("/{job_id}")
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = (
        db.query(Job)
        .options(
            joinedload(Job.company),
            joinedload(Job.required_skills).joinedload(JobRequiredSkill.skill),
            joinedload(Job.applications),
        )
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Lowongan tidak ditemukan")

    return serialize_job(job)


@router.post("")
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.company)),
):
    company = db.query(Company).filter(Company.user_id == user.id).first()

    if not company:
        raise HTTPException(status_code=404, detail="Data perusahaan tidak ditemukan")

    if not company.is_validated:
        raise HTTPException(status_code=403, detail="Akun perusahaan belum divalidasi admin")

    if len(payload.job_title) > 100:
        raise HTTPException(status_code=400, detail="ERR-VAL-11: Judul lowongan maksimal 100 karakter")

    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="ERR-VAL-12: Deskripsi pekerjaan wajib diisi")

    if not payload.job_qualification.strip():
        raise HTTPException(status_code=400, detail="ERR-VAL-12: Kualifikasi pekerjaan wajib diisi")

    if not payload.required_skills:
        raise HTTPException(status_code=400, detail="ERR-BUS-11: Lowongan wajib memiliki minimal 1 skill")

    if len(payload.required_skills) > 5:
        raise HTTPException(status_code=400, detail="Required skill maksimal 5")

    if payload.expired_date and payload.expired_date < datetime.utcnow():
        raise HTTPException(status_code=400, detail="ERR-VAL-13: Tanggal kedaluwarsa tidak valid")

    status = payload.status if payload.status in ["draft", "published", "closed"] else "draft"

    job = Job(
        company_id=company.id,
        job_title=payload.job_title,
        job_description=payload.job_description,
        job_qualification=payload.job_qualification,
        location=payload.location,
        salary_min=payload.salary_min,
        salary_max=payload.salary_max,
        job_type=payload.job_type,
        status=JobStatus(status),
        expired_date=payload.expired_date,
        is_validated=False,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    for required in payload.required_skills:
        db.add(
            JobRequiredSkill(
                job_id=job.id,
                skill_id=required.skill_id,
                minimum_level=required.minimum_level,
            )
        )

    db.commit()
    db.refresh(job)

    return {
        "message": "Lowongan berhasil dibuat, menunggu validasi admin",
        "job_id": job.id,
        "job": serialize_job(job),
    }


@router.patch("/{job_id}/close")
def close_job(
    job_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.company)),
):
    company = db.query(Company).filter(Company.user_id == user.id).first()

    if not company:
        raise HTTPException(status_code=404, detail="Data perusahaan tidak ditemukan")

    job = db.query(Job).filter(Job.id == job_id, Job.company_id == company.id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Lowongan tidak ditemukan")

    job.status = JobStatus.closed
    db.commit()
    db.refresh(job)

    return {
        "message": "Lowongan berhasil ditutup",
        "job": serialize_job(job),
    }