from sqlalchemy import Column, Integer, Date, Float, ForeignKey
from app.database import Base

class Devis(Base):
    __tablename__ = "devis"

    id = Column(Integer, primary_key=True)
    vehicule_id = Column(Integer, ForeignKey("vehicules.id"))
    police_id = Column(Integer, ForeignKey("polices.id"))
    date_effet = Column(Date)
    date_echeance = Column(Date)
    prime_total = Column(Float)
    valide = Column(Integer, default=0)
