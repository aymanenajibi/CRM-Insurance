from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.security import hash_password
from app.dependencies import admin_only

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    admin = Depends(admin_only)
):
    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        active=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}/activate")
def activate_user(
    user_id: int,
    active: bool,
    db: Session = Depends(get_db),
    admin = Depends(admin_only)
):
    user = db.query(User).filter(User.id == user_id).first()
    user.active = active
    db.commit()
    return {"message": "User status updated"}
