from sqlalchemy.orm import Session
from app.models import UserSkill, JobRequiredSkill


def calculate_matching_score(db: Session, user_id: int, job_id: int) -> float:
    """
    Mengikuti SRS/FSD:
    - hard skill menjadi parameter utama scoring
    - soft skill tidak dihitung dalam skor utama
    - skor disimpan dalam rentang 0-100
    """
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    job_skills = db.query(JobRequiredSkill).filter(JobRequiredSkill.job_id == job_id).all()

    if not job_skills:
        return 0.0

    user_skill_map = {item.skill_id: item.level for item in user_skills}
    total_score = 0

    for required in job_skills:
        user_level = user_skill_map.get(required.skill_id)
        if user_level is None:
            continue

        # Full match jika level user >= minimum level lowongan.
        # Partial match jika skill sama tetapi level masih kurang.
        if user_level >= required.minimum_level:
            total_score += 1
        else:
            total_score += user_level / required.minimum_level

    return round((total_score / len(job_skills)) * 100, 2)
