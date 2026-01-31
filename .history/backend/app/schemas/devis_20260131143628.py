from pydantic import BaseModel
from datetime import date

class DevisBase(BaseModel):
    vehicule_id: int
    police_id: int
    date_effet: date
    date_echeance: date
    prime_total: float

class DevisCreate(DevisBase):
    pass

class DevisResponse(DevisBase):
    id: int

    class Config:
        from_attributes = True
