from pydantic import BaseModel
from typing import Optional

class QuittanceBase(BaseModel):
    fk_devis_id: int
    fk_vehicule_id: int
    fk_client_id: int
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
