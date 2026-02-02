from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserUpdate,
    AdminUserUpdate,
    PasswordReset,
)
from app.utils.security import hash_password
from app.dependencies import get_current_user, admin_only

router = APIRouter(prefix="/users", tags=["Users"])


# ===================== GET ALL USERS (ADMIN) =====================
@router.get("/", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), admin=Depends(admin_only)):
    """Récupérer tous les utilisateurs (admin seulement)"""
    return db.query(User).all()


# ===================== GET CURRENT USER =====================
@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Récupérer les informations de l'utilisateur connecté"""
    return current_user


# ===================== UPDATE USER =====================
@router.put("/me", response_model=UserResponse)
def update_current_user(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mettre à jour l'utilisateur connecté"""
    # Vérifier l'unicité de l'email si changé
    if data.email is not None and data.email != current_user.email:
        existing_email = db.query(User).filter(User.email == data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email déjà utilisé"
            )

    # Vérifier l'unicité du username si changé
    if data.username is not None and data.username != current_user.username:
        existing_username = db.query(User).filter(User.username == data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nom d'utilisateur déjà utilisé"
            )

    # Mettre à jour les champs
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    
    return current_user


# ===================== CHANGE PASSWORD =====================
@router.put("/me/password")
def change_password(
    data: PasswordReset,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Changer le mot de passe de l'utilisateur connecté"""
    current_user.password = hash_password(data.new_password)
    db.commit()

    return {"message": "Mot de passe mis à jour avec succès"}


# ===================== ADMIN: CREATE USER =====================
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    """Créer un nouvel utilisateur (admin seulement)"""
    # Vérifier si l'email existe déjà
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email déjà utilisé"
        )

    # Vérifier si le username existe déjà
    existing_username = db.query(User).filter(User.username == user.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nom d'utilisateur déjà utilisé"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        active=True,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


# ===================== ADMIN: GET USER BY ID =====================
@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    """Récupérer un utilisateur par ID (admin seulement)"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    return user


# ===================== ADMIN: UPDATE USER =====================
@router.put("/{user_id}", response_model=UserResponse)
def admin_update_user(
    user_id: int,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_only),
):
    """Mettre à jour un utilisateur (admin seulement)"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    # Vérifier l'unicité de l'email si changé
    if data.email is not None and data.email != user.email:
        existing_email = db.query(User).filter(User.email == data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email déjà utilisé"
            )

    # Vérifier l'unicité du username si changé
    if data.username is not None and data.username != user.username:
        existing_username = db.query(User).filter(User.username == data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nom d'utilisateur déjà utilisé"
            )

    # Mettre à jour tous les champs
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    
    return user


# ===================== ADMIN: DELETE USER =====================
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    """Supprimer un utilisateur (admin seulement)"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    db.delete(user)
    db.commit()
    
    return None  