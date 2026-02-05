from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.quittance import Quittance
from app.models.paiement import Paiement
from app.models.devis import Devis
from app.schemas.quittance import (
    QuittanceCreate,
    QuittanceResponse,
    QuittanceUpdate,
    QuittanceEncaissement,
    PaymentData,
    QuittanceUpdateStatus
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
    """Crée une nouvelle quittance - MAINTENANT BLOQUÉE (création automatique uniquement)"""

    # VÉRIFIER si une quittance existe déjà pour ce devis
    if data.fk_devis_id:
        existing_quittance = db.query(Quittance).filter(
            Quittance.fk_devis_id == data.fk_devis_id
        ).first()

        if existing_quittance:
            raise HTTPException(
                status_code=400,
                detail="Une quittance existe déjà pour ce devis. Les quittances sont créées automatiquement."
            )

        # VÉRIFIER si le devis existe
        existing_devis = db.query(Devis).filter(Devis.id == data.fk_devis_id).first()
        if not existing_devis:
            raise HTTPException(
                status_code=404,
                detail=f"Le devis avec l'ID {data.fk_devis_id} n'existe pas."
            )

    # Extraire les données du schéma
    quittance_data = data.dict()

    # Calculer le solde si nécessaire
    solde = data.solde if data.solde is not None else (data.prime_total - data.montant_encaisse)
    quittance_data["solde"] = solde

    # Déterminer le statut initial
    statut_paiement = "impayé"
    if solde == 0 and data.montant_encaisse > 0:
        statut_paiement = "payé"
    elif data.montant_encaisse > 0 and solde > 0:
        statut_paiement = "partiel"

    quittance_data["statut_paiement"] = statut_paiement

    # Créer l'objet Quittance
    q = Quittance(**quittance_data)

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

    # Vérifier que le montant est positif
    if payment_data.montant_encaisse <= 0:
        raise HTTPException(status_code=400, detail="Le montant doit être positif")

    # Vérifier que le montant ne dépasse pas le solde
    montant_max = quittance.solde
    if payment_data.montant_encaisse > montant_max:
        raise HTTPException(
            status_code=400,
            detail=f"Le montant ({payment_data.montant_encaisse}) dépasse le solde restant ({montant_max})"
        )

    # Créer un paiement d'affichage
    paiement = Paiement(
        fk_quittance_id=quittance_id,
        montant=payment_data.montant_encaisse,
        methode=payment_data.mode_paiement,
        date_paiement=datetime.utcnow()
    )

    # Mettre à jour les totaux
    nouveau_montant_encaisse = quittance.montant_encaisse + payment_data.montant_encaisse
    nouveau_solde = max(0, quittance.prime_total - nouveau_montant_encaisse)

    quittance.montant_encaisse = nouveau_montant_encaisse
    quittance.solde = nouveau_solde
    quittance.mode_paiement = payment_data.mode_paiement

    # Mettre à jour automatiquement le statut
    if nouveau_solde == 0:
        quittance.statut_paiement = "payé"
    elif nouveau_montant_encaisse > 0:
        quittance.statut_paiement = "partiel"
    else:
        quittance.statut_paiement = "impayé"

    db.add(paiement)
    db.commit()
    db.refresh(quittance)

    return {
        "message": "Paiement enregistré avec succès",
        "statut": quittance.statut_paiement,
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

    # Mettre à jour automatiquement le statut
    if q.solde == 0 and q.montant_encaisse > 0:
        q.statut_paiement = "payé"
    elif q.montant_encaisse == 0:
        q.statut_paiement = "impayé"
    elif q.montant_encaisse > 0 and q.solde > 0:
        q.statut_paiement = "partiel"

    db.commit()
    db.refresh(q)
    return q

# ==========================================
# UPDATE PAYMENT STATUS
# PUT /quittance/update-status/{id}
# ==========================================
@router.put("/update-status/{id}", response_model=QuittanceResponse)
def update_payment_status(
    id: int,
    data: QuittanceUpdateStatus,
    db: Session = Depends(get_db)
):
    """Met à jour le statut de paiement d'une quittance"""
    q = db.query(Quittance).filter(Quittance.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quittance non trouvée")

    # Valider le statut
    statuts_valides = ["impayé", "partiel", "payé", "annulé", "remboursé", "en_attente"]
    if data.statut_paiement not in statuts_valides:
        raise HTTPException(
            status_code=400,
            detail=f"Statut invalide. Valeurs acceptées: {', '.join(statuts_valides)}"
        )

    # Mettre à jour les champs
    if data.statut_paiement:
        q.statut_paiement = data.statut_paiement

    if data.montant_encaisse is not None:
        q.montant_encaisse = data.montant_encaisse
        # Recalculer automatiquement le solde
        q.solde = max(0, q.prime_total - q.montant_encaisse)

    if data.solde is not None:
        q.solde = max(0, data.solde)
        # Recalculer montant_encaisse si solde fourni
        q.montant_encaisse = max(0, q.prime_total - q.solde)

    # Logique cohérence entre montants et statut
    if q.solde == 0 and q.montant_encaisse > 0 and q.statut_paiement != "payé":
        # Si solde = 0 et montant > 0, automatiquement "payé"
        q.statut_paiement = "payé"
    elif q.montant_encaisse == 0 and q.statut_paiement != "impayé":
        # Si aucun montant encaissé, automatiquement "impayé"
        q.statut_paiement = "impayé"
    elif q.solde > 0 and q.montant_encaisse > 0 and q.statut_paiement not in ["partiel", "en_attente"]:
        # Si montant partiel, automatiquement "partiel"
        q.statut_paiement = "partiel"

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


@router.get("/test/{quittance_id}")
def test_quittance(quittance_id: int, db: Session = Depends(get_db)):
    quittance = db.query(Quittance).filter(Quittance.id == quittance_id).first()

    # Retournez un dict simple pour vérifier
    return {
        "id": quittance.id,
        "statut_paiement": quittance.statut_paiement,  # Direct
        "montant_encaisse": quittance.montant_encaisse,
        "solde": quittance.solde
    }
