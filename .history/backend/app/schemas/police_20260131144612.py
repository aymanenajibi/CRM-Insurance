from pydantic import BaseModel
from datetime import date
from typing import Optional

class PoliceBase(BaseModel):
    num_police: str
    date_souscription: date
    fk_client_id: int

class PoliceCreate(PoliceBase):
    pass

class PoliceUpdate(BaseModel):
    num_police: Optional[str]
    date_souscription: Optional[date]
    fk_client_id: Optional[int]

class PoliceResponse(PoliceBase):
    id: int
    class Config:
        from_attributes = True
