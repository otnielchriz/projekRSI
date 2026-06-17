from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class RegisterUser(BaseModel):
    full_name: str = Field(..., max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class RegisterCompany(BaseModel):
    company_name: str = Field(..., max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    address: str
    description: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class SkillCreate(BaseModel):
    skill_name: str = Field(..., min_length=2, max_length=50)


class SkillOut(BaseModel):
    id: int
    skill_name: str
    is_active: bool
    class Config:
        from_attributes = True


class UserSkillCreate(BaseModel):
    skill_id: int
    level: int = Field(..., ge=1, le=5)


class ProjectCreate(BaseModel):
    project_name: str = Field(..., max_length=100)
    description: str
    link: Optional[str] = None
    skill_ids: List[int] = Field(default_factory=list)


class CertificateCreate(BaseModel):
    certificate_name: str = Field(..., max_length=100)
    issuer: str = Field(..., max_length=100)
    issue_date: str
    skill_id: Optional[int] = None


class SoftSkillCreate(BaseModel):
    soft_skill_name: str = Field(..., max_length=100)
    rating: int = Field(..., ge=1, le=5)


class JobRequiredSkillCreate(BaseModel):
    skill_id: int
    minimum_level: int = Field(..., ge=1, le=5)


class JobCreate(BaseModel):
    job_title: str = Field(..., max_length=100)
    job_description: str
    job_qualification: str
    location: str = Field(..., max_length=50)
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: str
    status: str = "draft"
    expired_date: Optional[datetime] = None
    required_skills: List[JobRequiredSkillCreate]


class ApplicationOut(BaseModel):
    id: int
    user_id: int
    job_id: int
    status: str
    matching_score: float
    applied_at: datetime
    class Config:
        from_attributes = True


class ApplicantSkillDetail(BaseModel):
    skill_name: str
    level: int


class ApplicantProjectDetail(BaseModel):
    project_name: str
    description: str
    link: Optional[str] = None


class ApplicantCertificateDetail(BaseModel):
    certificate_name: str
    issuer: str
    issue_date: str
    skill_name: Optional[str] = None


class JobApplicantDetailResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    status: str
    matching_score: float
    applied_at: Optional[datetime] = None
    applicant_name: str
    applicant_email: str
    cv_path: Optional[str] = None
    cv_message: Optional[str] = None
    skills: List[ApplicantSkillDetail] = []
    projects: List[ApplicantProjectDetail] = []
    certificates: List[ApplicantCertificateDetail] = []

    class Config:
        from_attributes = True
