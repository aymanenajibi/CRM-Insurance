from pydantic import BaseModel
from datetime import date
from typing import Optional

class DevisBase(BaseModel):
    fk_vehicule_id: int
    fk_police_id: int
    date_effet: date
    date_echeance: date
    prime_total: float

class DevisCreate(DevisBase):
    pass

class DevisUpdate(BaseModel):
    fk_vehicule_id: Optional[int]
    fk_police_id: Optional[int]
    date_effet: Optional[date]
    date_echeance: Optional[date]
    prime_total: Optional[float]

class DevisResponse(DevisBase):
    id: int
    class Config:
        from_attributes = True
