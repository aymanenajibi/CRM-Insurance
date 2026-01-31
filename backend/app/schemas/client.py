from pydantic import BaseModel
from datetime import date
from typing import Optional


class ClientBase(BaseModel):
    nom_complet: str
    cin: str
    date_naissance: date
    ville: str
    type_permis: str


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    nom_complet: Optional[str]
    cin: Optional[str]
    date_naissance: Optional[date]
    ville: Optional[str]
    type_permis: Optional[str]


class ClientResponse(ClientBase):
    id: int

    class Config:
        from_attributes = True
