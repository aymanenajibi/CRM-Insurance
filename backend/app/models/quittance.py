from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Quittance(Base):
    __tablename__ = "quittances"

    id = Column(Integer, primary_key=True, index=True)
    fk_devis_id = Column(Integer, ForeignKey("devis.id"), nullable=False)
    fk_vehicule_id = Column(Integer, ForeignKey("vehicules.id"), nullable=False)
    fk_client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    prime_total = Column(Float, nullable=False)
    mt_encaisser = Column(Float, default=0)
    solde = Column(Float, nullable=False)
    mode_payment = Column(String(50), default="")

    devis = relationship("Devis", back_populates="quittance")
