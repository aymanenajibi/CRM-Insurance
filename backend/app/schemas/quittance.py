from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.paiement import PaiementResponse
from app.schemas.client import ClientResponse
from app.schemas.vehicule import VehiculeResponse
from app.schemas.devis import DevisResponse


class QuittanceBase(BaseModel):
    fk_devis_id: Optional[int]
    fk_vehicule_id: Optional[int]
    fk_client_id: Optional[int]
    prime_total: float
    montant_encaisse: float = 0
    solde: float
    mode_paiement: str = ""


class QuittanceCreate(QuittanceBase):
    pass


class QuittanceUpdate(BaseModel):
    montant_encaisse: Optional[float]
    mode_paiement: Optional[str]
    solde: Optional[float]


class QuittanceResponse(QuittanceBase):
    id: int
    client: Optional[ClientResponse] = None
    vehicule: Optional[VehiculeResponse] = None
    devis: Optional[DevisResponse] = None
    paiements: List[PaiementResponse] = []

    class Config:
        from_attributes = True


class QuittanceEncaissement(BaseModel):
    date_encaissement: date

class PaymentData(BaseModel):
    montant_encaisse: float
    mode_paiement: str
