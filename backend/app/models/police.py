from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Police(Base):
    __tablename__ = "polices"

    id = Column(Integer, primary_key=True, index=True)
    num_police = Column(String, unique=True, nullable=False)
    date_souscription = Column(Date)

    fk_client_id = Column(Integer, ForeignKey("clients.id"))

    # RELATIONS
    client = relationship("Client", back_populates="polices")
    devis = relationship("Devis", back_populates="police", cascade="all, delete")
