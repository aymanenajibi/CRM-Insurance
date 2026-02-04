from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class DevisBase(BaseModel):
    fk_client_id: int
    fk_vehicule_id: int
    fk_police_id: int
    date_effet: date
    date_echeance: date
    prime_total: float
    num_devis: str
    statut: str




class DevisCreate(DevisBase):
    pass


class DevisUpdate(BaseModel):
    fk_client_id: Optional[int] = None
    fk_vehicule_id: Optional[int] = None
    fk_police_id: Optional[int] = None
    date_effet: Optional[date] = None
    date_echeance: Optional[date] = None
    prime_total: Optional[float] = None
    num_devis: Optional[str] = None
    statut: Optional[str] = None


class DevisResponse(DevisBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
