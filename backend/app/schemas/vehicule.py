from pydantic import BaseModel
from datetime import date
from typing import Optional

class VehiculeBase(BaseModel):
    matricule: str
    marque: str
    model: str
    date_mise_circulation: date
    valeur_venale: float
    puissance_fiscale: float

class VehiculeCreate(VehiculeBase):
    pass

class VehiculeUpdate(BaseModel):
    matricule: Optional[str]
    marque: Optional[str]
    model: Optional[str]
    date_mise_circulation: Optional[date]
    valeur_venale: Optional[float]
    puissance_fiscale: Optional[float]

class VehiculeResponse(VehiculeBase):
    id: int
    class Config:
        from_attributes = True
