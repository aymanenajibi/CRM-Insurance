from pydantic import BaseModel

class QuittanceBase(BaseModel):
    devis_id: int
    vehicule_id: int
    client_id: int
    prime_total: float
    montant_encaisse: float
    mode_paiement: str

class QuittanceResponse(QuittanceBase):
    id: int
    solde: float

    class Config:
        from_attributes = True
