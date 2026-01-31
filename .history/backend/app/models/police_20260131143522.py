from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base

class Police(Base):
    __tablename__ = "polices"

    id = Column(Integer, primary_key=True)
    numpolice = Column(String, unique=True)
    date_souscription = Column(Date)
    client_id = Column(Integer, ForeignKey("clients.id"))
