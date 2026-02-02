from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.models.user import User

# Configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
SECRET_KEY = os.getenv(
    "SECRET_KEY", "123456789ABCDEFGHIGKLMNOPQRSTUVWXYZzyxwvutsrqponmlkjihgfedcba9876543210"
)
ALGORITHM = os.getenv("ALGORITHM", "HS256")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    """Récupère l'utilisateur actuel à partir du token JWT"""

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Décoder le token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user_id = int(user_id)

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expiré"
        )
    except (JWTError, ValueError):
        raise credentials_exception

    # Récupérer l'utilisateur depuis la base de données
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise credentials_exception

    # Vérifier si l'utilisateur est actif
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Compte désactivé"
        )

    return user


def admin_only(user: User = Depends(get_current_user)) -> User:
    """Vérifie que l'utilisateur est un administrateur"""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs",
        )
    return user
