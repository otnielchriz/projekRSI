from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Company, UserRole
from app.schemas import RegisterUser, RegisterCompany, LoginRequest, TokenResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.routes.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


def user_to_dict(user: User):
    data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role.value,
        "is_verified": user.is_verified,
        "is_locked": user.is_locked,
    }
    if user.company:
        data["company"] = {
            "id": user.company.id,
            "company_name": user.company.company_name,
            "address": user.company.address,
            "description": user.company.description,
            "is_validated": user.company.is_validated,
        }
    return data


@router.post("/register/user")
def register_user(payload: RegisterUser, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=UserRole.user,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registrasi pelamar berhasil", "user_id": user.id}


@router.post("/register/company")
def register_company(payload: RegisterCompany, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user = User(
        full_name=payload.company_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=UserRole.company,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    company = Company(
        user_id=user.id,
        company_name=payload.company_name,
        address=payload.address,
        description=payload.description,
        is_validated=False,
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return {"message": "Registrasi perusahaan berhasil, menunggu validasi admin", "company_id": company.id}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Email atau password salah")

    if user.is_locked:
        raise HTTPException(status_code=403, detail="Akun terkunci karena 5 kali gagal login")

    if not verify_password(payload.password, user.password_hash):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            user.is_locked = True
        db.commit()
        raise HTTPException(status_code=401, detail="Email atau password salah")

    user.failed_login_attempts = 0
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, role=user.role.value)


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return user_to_dict(current_user)


@router.get("/me/company")
def me_company(current_user: User = Depends(get_current_user)):
    if current_user.role.value != "company":
        raise HTTPException(status_code=403, detail="Hanya perusahaan yang bisa akses endpoint ini")
    if not current_user.company:
        raise HTTPException(status_code=404, detail="Data perusahaan tidak ditemukan")
    return {
        "user": user_to_dict(current_user),
        "company": {
            "id": current_user.company.id,
            "company_name": current_user.company.company_name,
            "address": current_user.company.address,
            "description": current_user.company.description,
            "is_validated": current_user.company.is_validated,
            "logo_path": current_user.company.logo_path,
        }
    }
