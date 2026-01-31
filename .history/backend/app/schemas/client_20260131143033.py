from pydantic import BaseModel
from datetime import date

class ClientBase(BaseModel):
    nom_complet: str
    cin: str
    date_naissance: date | None = None
    ville: str | None = None
    type_permis: str | None = None

class ClientResponse(ClientBase):
    id: int
    class Config:
        from_attributes = True
