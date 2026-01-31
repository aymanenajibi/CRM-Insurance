from sqlalchemy import Column, Integer, String, Date, Float
from app.database import Base

class Vehicule(Base):
    __tablename__ = "vehicules"

    id = Column(Integer, primary_key=True)
    matricule = Column(String, unique=True)
    marque = Column(String)
    modele = Column(String)
    date_mise_en_circulation = Column(Date)
    valeur_venale = Column(Float)
    puissance_fiscale = Column(Integer)
