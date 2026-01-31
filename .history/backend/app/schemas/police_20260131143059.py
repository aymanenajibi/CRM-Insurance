from pydantic import BaseModel
from datetime import date

class PoliceBase(BaseModel):
    num_police: str
    date_souscription: date
    client_id: int

class PoliceResponse(PoliceBase):
    id: int
    class Config:
        from_attributes = True
