from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Skill, UserRole
from app.schemas import SkillCreate
from app.routes.dependencies import require_role

router = APIRouter(prefix="/skills", tags=["Skill Master"])


def serialize_skill(skill: Skill):
    return {"id": skill.id, "skill_name": skill.skill_name, "is_active": skill.is_active}


@router.get("")
def list_skills(db: Session = Depends(get_db)):
    return [serialize_skill(skill) for skill in db.query(Skill).filter(Skill.is_active == True).order_by(Skill.skill_name.asc()).all()]


@router.post("")
def create_skill(payload: SkillCreate, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    exists = db.query(Skill).filter(Skill.skill_name == payload.skill_name).first()
    if exists:
        raise HTTPException(status_code=400, detail="ERR-VAL-21: Nama skill duplikat")
    skill = Skill(skill_name=payload.skill_name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return serialize_skill(skill)


@router.patch("/{skill_id}/deactivate")
def deactivate_skill(skill_id: int, db: Session = Depends(get_db), admin=Depends(require_role(UserRole.admin))):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill tidak ditemukan")
    skill.is_active = False
    db.commit()
    return {"message": "Skill berhasil dinonaktifkan"}
