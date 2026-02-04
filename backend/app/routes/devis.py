from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.devis import Devis
from app.models.police import Police
from app.models.quittance import Quittance
from app.schemas.devis import DevisCreate, DevisUpdate, DevisResponse
from app.dependencies import admin_only

router = APIRouter(prefix="/devis", tags=["Devis"])

# ==========================================
# GET ALL DEVIS
# devis/all
# ==========================================
@router.get("/all", response_model=List[DevisResponse])
def get_all_devis(db: Session = Depends(get_db)):
    devis_list = db.query(Devis).all()
    return devis_list


# ==========================================
# CREATE DEVIS
# devis/create
# ==========================================
@router.post("/create", response_model=DevisResponse, status_code=status.HTTP_201_CREATED)
def create_devis(data: DevisCreate, db: Session = Depends(get_db)):
    # Vérifier si le numéro de devis existe déjà
    existing_devis = db.query(Devis).filter(Devis.num_devis == data.num_devis).first()
    if existing_devis:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce numéro de devis existe déjà."
        )

    # Vérifier si la police existe
    police = db.query(Police).filter(Police.id == data.fk_police_id).first()
    if not police:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La police avec l'ID {data.fk_police_id} n'existe pas."
        )

    # créer le devis
    devis = Devis(**data.dict())
    db.add(devis)
    db.commit()
    db.refresh(devis)

    # créer automatiquement la quittance
    quittance = Quittance(
        fk_devis_id=devis.id,
        fk_client_id=devis.fk_client_id,
        fk_vehicule_id=devis.fk_vehicule_id,
        prime_total=devis.prime_total,
        montant_encaisse=0,
        solde=devis.prime_total,
        mode_paiement="",
    )

    db.add(quittance)
    db.commit()

    return devis


# ==========================================
# UPDATE DEVIS
# devis/update/{devis_id}
# ==========================================
@router.put("/update/{devis_id}", response_model=DevisResponse)
def update_devis(devis_id: int, data: DevisUpdate, db: Session = Depends(get_db)):
    devis = db.query(Devis).filter(Devis.id == devis_id).first()
    if not devis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Devis non trouvé"
        )

    # Vérifier si le nouveau numéro de devis existe déjà (sauf pour ce devis)
    if data.num_devis and data.num_devis != devis.num_devis:
        existing_devis = db.query(Devis).filter(
            Devis.num_devis == data.num_devis,
            Devis.id != devis_id
        ).first()
        if existing_devis:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce numéro de devis existe déjà."
            )

    # Vérifier si la police existe
    if data.fk_police_id:
        police = db.query(Police).filter(Police.id == data.fk_police_id).first()
        if not police:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"La police avec l'ID {data.fk_police_id} n'existe pas."
            )

    # Mettre à jour les champs
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(devis, key, value)

    # Mise à jour automatique de la quittance
    if devis.quittance and (data.prime_total is not None):
        devis.quittance.prime_total = data.prime_total
        devis.quittance.solde = data.prime_total - devis.quittance.montant_encaisse

    db.commit()
    db.refresh(devis)
    return devis


# ==========================================
# DELETE DEVIS (ADMIN ONLY)
# devis/delete/{devis_id}
# ==========================================
@router.delete("/delete/{devis_id}")
def delete_devis(
    devis_id: int, db: Session = Depends(get_db), admin=Depends(admin_only)
):
    devis = db.query(Devis).filter(Devis.id == devis_id).first()
    if not devis:
        raise HTTPException(status_code=404, detail="Devis not found")

    db.delete(devis)
    db.commit()
    return {"message": "Devis deleted"}
