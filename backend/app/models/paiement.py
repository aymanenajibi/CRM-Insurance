from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Paiement(Base):
    __tablename__ = "paiements"

    id = Column(Integer, primary_key=True, index=True)
    fk_quittance_id = Column(Integer, ForeignKey("quittances.id"))

    montant = Column(Float, nullable=False)
    methode = Column(String)
    date_paiement = Column(DateTime, default=datetime.utcnow)

    # RELATION SIMPLE
    quittance = relationship("Quittance", back_populates="paiements")
