from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "user"

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True
