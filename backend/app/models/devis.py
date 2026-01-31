from sqlalchemy import Column, Integer, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Devis(Base):
    __tablename__ = "devis"

    id = Column(Integer, primary_key=True, index=True)
    fk_vehicule_id = Column(Integer, ForeignKey("vehicules.id"), nullable=False)
    fk_police_id = Column(Integer, ForeignKey("polices.id"), nullable=False)
    date_effet = Column(Date, nullable=False)
    date_echeance = Column(Date, nullable=False)
    prime_total = Column(Float, nullable=False)

    vehicule = relationship("Vehicule")
    police = relationship("Police")
    quittance = relationship("Quittance", back_populates="devis", uselist=False)
