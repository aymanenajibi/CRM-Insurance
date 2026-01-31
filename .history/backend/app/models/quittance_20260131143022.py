from sqlalchemy import Column, Integer, Float, ForeignKey
from app.database import Base

class Quittance(Base):
    __tablename__ = "quittances"

    id = Column(Integer, primary_key=True)
    devis_id = Column(Integer, ForeignKey("devis.id"))
    vehicule_id = Column(Integer, ForeignKey("vehicules.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    prime_total = Column(Float)
    montant_encaisse = Column(Float, default=0)
    solde = Column(Float)
