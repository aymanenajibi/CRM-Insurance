from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.utils.security import (
    verify_password,
    create_access_token,
    hash_password
)

router = APIRouter(prefix="/auth", tags=["Auth"])

# ===================== SCHEMAS =====================

class LoginSchema(BaseModel):
    email: str
    password: str

class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str


# ===================== LOGIN =====================

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.active:
        raise HTTPException(status_code=403, detail="User inactive")

    token = create_access_token(
        {"sub": str(user.id), "role": user.role}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "active": user.active,
            "created_at": user.created_at
        }
    }



# ===================== REGISTER =====================

@router.post("/register", status_code=201)
def register(data: RegisterSchema, db: Session = Depends(get_db)):

    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
        role="user",
        active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully", "id": user.id}
