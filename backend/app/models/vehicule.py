from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class Vehicule(Base):
    __tablename__ = "vehicules"

    id = Column(Integer, primary_key=True, index=True)
    matricule = Column(String(50), unique=True, nullable=False)
    marque = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    date_mise_circulation = Column(Date, nullable=False)
    valeur_venale = Column(Float, nullable=False)
    puissance_fiscale = Column(Float, nullable=False)
