from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Vehicule(Base):
    __tablename__ = "vehicules"

    id = Column(Integer, primary_key=True, index=True)
    matricule = Column(String, unique=True, nullable=False)
    marque = Column(String)
    model = Column(String)
    date_mise_en_circulation = Column(Date)
    valeur_venale = Column(Float)
    puissance_fiscale = Column(Integer)

    fk_client_id = Column(Integer, ForeignKey("clients.id"))

    # RELATIONS
    client = relationship("Client", back_populates="vehicules")
    devis = relationship("Devis", back_populates="vehicule", cascade="all, delete")
    quittances = relationship("Quittance", back_populates="vehicule", cascade="all, delete")
