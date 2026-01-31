from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Quittance(Base):
    __tablename__ = "quittances"

    id = Column(Integer, primary_key=True, index=True)

    fk_devis_id = Column(Integer, ForeignKey("devis.id"))
    fk_client_id = Column(Integer, ForeignKey("clients.id"))
    fk_vehicule_id = Column(Integer, ForeignKey("vehicules.id"))

    prime_total = Column(Float)
    montant_encaisse = Column(Float, default=0)
    solde = Column(Float)
    mode_paiement = Column(String)

    # RELATIONS
    devis = relationship("Devis", back_populates="quittance")
    client = relationship("Client", back_populates="quittances")
    vehicule = relationship("Vehicule", back_populates="quittances")
