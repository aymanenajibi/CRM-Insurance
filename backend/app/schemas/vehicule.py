from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.schemas.client import ClientResponse


class VehiculeBase(BaseModel):
    matricule: str
    marque: Optional[str] = None
    model: Optional[str] = None
    date_mise_en_circulation: Optional[date] = None
    valeur_venale: Optional[float] = None
    puissance_fiscale: Optional[float] = None
    fk_client_id: Optional[int] = None


class VehiculeCreate(VehiculeBase):
    matricule: str
    fk_client_id: int


class VehiculeUpdate(BaseModel):
    matricule: Optional[str] = None
    marque: Optional[str] = None
    model: Optional[str] = None
    date_mise_en_circulation: Optional[date] = None
    valeur_venale: Optional[float] = None
    puissance_fiscale: Optional[float] = None
    fk_client_id: Optional[int] = None


class VehiculeResponse(VehiculeBase):
    id: int
    client: Optional[ClientResponse] = None

    class Config:
        from_attributes = True
