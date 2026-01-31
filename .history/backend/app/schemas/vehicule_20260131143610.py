from pydantic import BaseModel
from datetime import date

class VehiculeBase(BaseModel):
    matricule: str
    marque: str | None
    model: str | None
    date_mise_circulation: date | None
    valeur_venale: float | None
    puissance_fiscale: int | None

class VehiculeCreate(VehiculeBase):
    pass

class VehiculeResponse(VehiculeBase):
    id: int

    class Config:
        from_attributes = True
