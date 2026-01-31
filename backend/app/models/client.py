from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    nom_complet = Column(String, nullable=False)
    cin = Column(String, unique=True, nullable=False)
    date_naissance = Column(Date)
    ville = Column(String)
    type_permis = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # RELATIONS
    polices = relationship("Police", back_populates="client", cascade="all, delete")
    vehicules = relationship("Vehicule", back_populates="client", cascade="all, delete")
    devis = relationship("Devis", back_populates="client", cascade="all, delete")
    quittances = relationship("Quittance", back_populates="client", cascade="all, delete")
