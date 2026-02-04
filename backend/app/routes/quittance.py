from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.quittance import Quittance
from app.models.paiement import Paiement
from app.schemas.quittance import (
    QuittanceCreate,
    QuittanceResponse,
    QuittanceUpdate,
    QuittanceEncaissement,
    PaymentData
)

router = APIRouter(prefix="/quittance", tags=["Quittance"])


# ==========================================
# GET ALL QUITTANCES
# GET /quittance/all
# ==========================================
@router.get("/all", response_model=list[QuittanceResponse])
def get_all(db: Session = Depends(get_db)):
    """Récupère toutes les quittances avec leurs paiements"""
    return db.query(Quittance).all()


# ==========================================
# GET QUITTANCE BY ID
# GET /quittance/{quittance_id}
# ==========================================
@router.get("/{quittance_id}", response_model=QuittanceResponse)
def get_by_id(quittance_id: int, db: Session = Depends(get_db)):
    """Récupère une quittance par ID avec ses paiements"""
    quittance = db.query(Quittance).filter(Quittance.id == quittance_id).first()
    if not quittance:
        raise HTTPException(status_code=404, detail="Quittance non trouvée")
    return quittance


# ==========================================
# CREATE QUITTANCE
# POST /quittance/create
# ==========================================
@router.post("/create", response_model=QuittanceResponse)
def create(data: QuittanceCreate, db: Session = Depends(get_db)):
    """Crée une nouvelle quittance"""
    # Calcul simple du solde si non fourni
    solde = data.solde if data.solde is not None else (data.prime_total - data.montant_encaisse)

    q = Quittance(
        **data.dict(),
        solde=solde
    )

    db.add(q)
    db.commit()
    db.refresh(q)
    return q


# ==========================================
# REGISTER PAYMENT
# POST /quittance/encaisser/{quittance_id}
# ==========================================
@router.post("/encaisser/{quittance_id}")
def encaisser_paiement(
    quittance_id: int,
    payment_data: PaymentData,
    db: Session = Depends(get_db)
):
    """Enregistre un paiement simple pour une quittance (simulation)"""
    # Récupérer la quittance
    quittance = db.query(Quittance).filter(Quittance.id == quittance_id).first()
    if not quittance:
        raise HTTPException(status_code=404, detail="Quittance non trouvée")

    # Créer un paiement d'affichage
    paiement = Paiement(
        fk_quittance_id=quittance_id,
        montant=payment_data.montant_encaisse,
        methode=payment_data.mode_paiement,
        date_paiement=datetime.utcnow()
    )

    # Mettre à jour les totaux (simulation simple)
    nouveau_montant_encaisse = quittance.montant_encaisse + payment_data.montant_encaisse
    nouveau_solde = max(0, quittance.prime_total - nouveau_montant_encaisse)

    quittance.montant_encaisse = nouveau_montant_encaisse
    quittance.solde = nouveau_solde
    quittance.mode_paiement = payment_data.mode_paiement

    db.add(paiement)
    db.commit()
    db.refresh(quittance)

    return {
        "message": "Paiement enregistré",
        "nouveau_solde": nouveau_solde,
        "montant_total_encaisse": nouveau_montant_encaisse,
        "quittance_id": quittance_id
    }


# ==========================================
# MARK AS PAID (LEGACY)
# PUT /quittance/encaisser/{id}
# ==========================================
@router.put("/encaisser/{id}")
def marquer_encaisser(id: int, data: QuittanceEncaissement, db: Session = Depends(get_db)):
    """Marque une quittance comme encaissée (ancienne méthode)"""
    q = db.query(Quittance).get(id)
    if not q:
        raise HTTPException(status_code=404, detail="Quittance not found")

    # Pour compatibilité, on peut créer un paiement fictif si aucun paiement n'existe
    paiements_existants = db.query(Paiement).filter(Paiement.fk_quittance_id == id).count()
    if paiements_existants == 0 and q.montant_encaisse > 0:
        paiement = Paiement(
            fk_quittance_id=id,
            montant=q.montant_encaisse,
            methode=q.mode_paiement or "Non spécifié",
            date_paiement=datetime.utcnow()
        )
        db.add(paiement)

    db.commit()
    return {"message": "Quittance marquée comme encaissée"}


# ==========================================
# UPDATE QUITTANCE
# PUT /quittance/update/{id}
# ==========================================
@router.put("/update/{id}", response_model=QuittanceResponse)
def update_quittance(id: int, data: QuittanceUpdate, db: Session = Depends(get_db)):
    """Met à jour une quittance"""
    q = db.query(Quittance).filter(Quittance.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quittance non trouvée")

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(q, field, value)

    # Recalculer le solde si montant_encaisse est modifié
    if 'montant_encaisse' in update_data:
        q.solde = max(0, q.prime_total - q.montant_encaisse)

    db.commit()
    db.refresh(q)
    return q


# ==========================================
# DELETE QUITTANCE
# DELETE /quittance/delete/{id}
# ==========================================
@router.delete("/delete/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    """Supprime une quittance et ses paiements associés"""
    q = db.query(Quittance).filter(Quittance.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quittance non trouvée")

    db.delete(q)
    db.commit()
    return {"message": "Quittance supprimée"}


# ==========================================
# GET PAYMENTS FOR QUITTANCE
# GET /quittance/{quittance_id}/paiements
# ==========================================
@router.get("/{quittance_id}/paiements")
def get_paiements_quittance(quittance_id: int, db: Session = Depends(get_db)):
    """Récupère tous les paiements d'une quittance (pour affichage)"""
    quittance = db.query(Quittance).filter(Quittance.id == quittance_id).first()
    if not quittance:
        raise HTTPException(status_code=404, detail="Quittance non trouvée")

    paiements = db.query(Paiement).filter(Paiement.fk_quittance_id == quittance_id).all()

    return {
        "quittance_id": quittance_id,
        "total_paiements": sum(p.montant for p in paiements),
        "nombre_paiements": len(paiements),
        "paiements": paiements
    }
