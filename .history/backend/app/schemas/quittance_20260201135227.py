from pydantic import BaseModel
from typing import Optional
from datetime import date


class QuittanceBase(BaseModel):
    fk_devis_id: Optional[int]
    fk_vehicule_id: Optional[int]
    fk_client_id: Optional[int]  
    prime_total: float
    mt_encaisser: float = 0
    solde: float
    mode_payment: str = ""


class QuittanceCreate(QuittanceBase):
    pass


class QuittanceUpdate(BaseModel):
    mt_encaisser: Optional[float]
    mode_payment: Optional[str]


class QuittanceResponse(QuittanceBase):
    id: int

    class Config:
        from_attributes = True


class QuittanceEncaissement(BaseModel):
    date_encaissement: date
