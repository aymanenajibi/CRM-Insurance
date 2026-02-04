from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.paiement import Paiement
from app.models.quittance import Quittance
from app.schemas.paiement import PaiementCreate, PaiementResponse

router = APIRouter(prefix="/paiement", tags=["Paiement"])


# ==========================================
# GET ALL PAYMENTS
# GET /paiement/all
# ==========================================
@router.get("/all", response_model=List[PaiementResponse])
def get_all_paiements(db: Session = Depends(get_db)):
    """Récupère tous les paiements (pour affichage)"""
    return db.query(Paiement).all()


# ==========================================
# GET PAYMENTS BY QUITTANCE
# GET /paiement/quittance/{quittance_id}
# ==========================================
@router.get("/quittance/{quittance_id}", response_model=List[PaiementResponse])
def get_paiements_quittance(quittance_id: int, db: Session = Depends(get_db)):
    """Récupère les paiements d'une quittance (pour affichage)"""
    return db.query(Paiement).filter(Paiement.fk_quittance_id == quittance_id).all()


# ==========================================
# CREATE PAYMENT
# POST /paiement/create
# ==========================================
@router.post("/create", response_model=PaiementResponse)
def create_paiement(data: PaiementCreate, db: Session = Depends(get_db)):
    """Crée un paiement simple (pour simulation)"""
    # Simple vérification que la quittance existe
    quittance = db.query(Quittance).filter(Quittance.id == data.fk_quittance_id).first()
    if not quittance:
        raise HTTPException(status_code=404, detail="Quittance non trouvée")

    # Création simple du paiement
    paiement = Paiement(**data.dict())

    db.add(paiement)
    db.commit()
    db.refresh(paiement)

    return paiement


# ==========================================
# DELETE PAYMENT
# DELETE /paiement/delete/{paiement_id}
# ==========================================
@router.delete("/delete/{paiement_id}")
def delete_paiement(paiement_id: int, db: Session = Depends(get_db)):
    """Supprime un paiement"""
    paiement = db.query(Paiement).filter(Paiement.id == paiement_id).first()
    if not paiement:
        raise HTTPException(status_code=404, detail="Paiement non trouvé")

    db.delete(paiement)
    db.commit()

    return {"message": "Paiement supprimé"}
