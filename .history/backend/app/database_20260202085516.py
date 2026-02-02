from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:password@localhost/fastapi_auth"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- CREER LES TABLES ----------

# Importer tous les modèles ici pour que SQLAlchemy sache qu'ils existent
from app.models.user import User
from app.models.client import Client
from app.models.vehicule import Vehicule
from app.models.police import Police
from app.models.devis import Devis
from app.models.quittance import Quittance


# Crée toutes les tables dans la DB
def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Tables créées avec succès")
