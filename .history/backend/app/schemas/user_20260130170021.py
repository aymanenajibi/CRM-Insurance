from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


# ===== LOGIN =====
class LoginSchema(BaseModel):
    email: EmailStr
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Le mot de passe doit contenir au moins 6 caractères')
        return v


# ===== REGISTER =====
class RegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Le nom d\'utilisateur doit contenir au moins 3 caractères')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Le mot de passe doit contenir au moins 6 caractères')
        return v


# ===== CREATE USER (ADMIN) =====
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "user"
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Le mot de passe doit contenir au moins 6 caractères')
        return v


# ===== UPDATE USER =====
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None


class AdminUserUpdate(UserUpdate):
    role: Optional[str] = None
    active: Optional[bool] = None


# ===== PASSWORD =====
class PasswordReset(BaseModel):
    new_password: str
    
    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Le mot de passe doit contenir au moins 6 caractères')
        return v


# ===== RESPONSE =====
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ===== AUTH RESPONSE =====
class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse