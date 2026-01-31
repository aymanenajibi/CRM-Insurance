from sqlalchemy import Column, Integer, String, Date, DateTime
from datetime import datetime
from app.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    nomcomplet = Column(String, nullable=False)
    cin = Column(String, unique=True, nullable=False)
    date_naissance = Column(Date)
    ville = Column(String)
    type_permis = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
