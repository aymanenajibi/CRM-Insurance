from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    nom_complet = Column(String(150), nullable=False)
    cin = Column(String(20), unique=True, nullable=False)
    date_naissance = Column(Date, nullable=False)
    ville = Column(String(100), nullable=False)
    type_permis = Column(String(50), nullable=False)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())

    polices = relationship("Police", back_populates="client")