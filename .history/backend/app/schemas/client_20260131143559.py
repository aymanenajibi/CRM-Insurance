from pydantic import BaseModel
from datetime import date, datetime

class ClientBase(BaseModel):
    nomcomplet: str
    cin: str
    date_naissance: date | None = None
    ville: str | None = None
    type_permis: str | None = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
