from pydantic import BaseModel

class EncaissementSchema(BaseModel):
    montant: float
