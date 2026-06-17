from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    user = "user"
    company = "company"
    admin = "admin"


class JobStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    closed = "closed"


class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.user)
    failed_login_attempts = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="user", uselist=False)
    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")
    soft_skills = relationship("SoftSkill", back_populates="user", cascade="all, delete-orphan")
    cv = relationship("CV", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    logo_path = Column(String(255), nullable=True)
    is_validated = Column(Boolean, default=False)

    user = relationship("User", back_populates="company")
    jobs = relationship("Job", back_populates="company")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(50), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserSkill(Base):
    __tablename__ = "user_skills"
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    level = Column(Integer, nullable=False)

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    link = Column(String(255), nullable=True)

    user = relationship("User", back_populates="projects")
    project_skills = relationship("ProjectSkill", cascade="all, delete-orphan")


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    certificate_name = Column(String(100), nullable=False)
    issuer = Column(String(100), nullable=False)
    issue_date = Column(String(20), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)

    user = relationship("User", back_populates="certificates")
    skill = relationship("Skill")


class SoftSkill(Base):
    __tablename__ = "soft_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    soft_skill_name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)

    user = relationship("User", back_populates="soft_skills")


class CV(Base):
    __tablename__ = "cvs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    file_path = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cv")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    job_title = Column(String(100), nullable=False)
    job_description = Column(Text, nullable=False)
    job_qualification = Column(Text, nullable=False)
    location = Column(String(50), nullable=False)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    job_type = Column(String(30), nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.draft)
    expired_date = Column(DateTime, nullable=True)
    is_validated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    required_skills = relationship("JobRequiredSkill", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job")


class JobRequiredSkill(Base):
    __tablename__ = "job_required_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    minimum_level = Column(Integer, nullable=False, default=1)

    job = relationship("Job", back_populates="required_skills")
    skill = relationship("Skill")


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("user_id", "job_id", name="uq_user_job_application"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.pending)
    matching_score = Column(Float, default=0.0)
    applied_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
