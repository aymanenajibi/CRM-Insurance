from pydantic import BaseModel
from datetime import datetime

class PaiementBase(BaseModel):
    fk_quittance_id: int
    montant: float
    methode: str

class PaiementCreate(PaiementBase):
    pass

class PaiementResponse(PaiementBase):
    id: int
    date_paiement: datetime

    class Config:
        from_attributes = True
