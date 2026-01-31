from pydantic import BaseModel
from datetime import date

class PoliceBase(BaseModel):
    numpolice: str
    date_souscription: date
    client_id: int

class PoliceCreate(PoliceBase):
    pass

class PoliceResponse(PoliceBase):
    id: int

    class Config:
        from_attributes = True
