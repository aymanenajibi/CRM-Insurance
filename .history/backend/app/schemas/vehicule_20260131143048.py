from pydantic import BaseModel
from datetime import date

class VehiculeBase(BaseModel):
    matricule: str
    marque: str
    modele: str
    date_mise_en_circulation: date
    valeur_venale: float
    puissance_fiscale: int

class VehiculeResponse(VehiculeBase):
    id: int
    class Config:
        from_attributes = True
