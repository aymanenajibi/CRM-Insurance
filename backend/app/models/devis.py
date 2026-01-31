from sqlalchemy import Column, Integer, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Devis(Base):
    __tablename__ = "devis"

    id = Column(Integer, primary_key=True, index=True)
    date_effet = Column(Date)
    date_echeance = Column(Date)
    prime_total = Column(Float)

    fk_client_id = Column(Integer, ForeignKey("clients.id"))
    fk_vehicule_id = Column(Integer, ForeignKey("vehicules.id"))
    fk_police_id = Column(Integer, ForeignKey("polices.id"))

    # RELATIONS
    client = relationship("Client", back_populates="devis")
    vehicule = relationship("Vehicule", back_populates="devis")
    police = relationship("Police", back_populates="devis")
    quittance = relationship("Quittance", back_populates="devis", uselist=False)
