from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.devis import Devis
from app.models.police import Police
from app.models.quittance import Quittance
from app.schemas.devis import DevisCreate, DevisUpdate, DevisResponse
from app.dependencies import admin_only

router = APIRouter(prefix="/devis", tags=["Devis"])


# ===================== ALL =====================
@router.get("/all", response_model=List[DevisResponse])
def get_all_devis(db: Session = Depends(get_db)):
    return db.query(Devis).all()


# ===================== CREATE =====================
@router.post("/create", response_model=DevisResponse)
def create_devis(data: DevisCreate, db: Session = Depends(get_db)):

    # 1️⃣ vérifier la police
    police = db.query(Police).filter(Police.id == data.fk_police_id).first()
    if not police:
        raise HTTPException(status_code=404, detail="Police not found")

    # 2️⃣ créer le devis
    devis = Devis(**data.dict())
    db.add(devis)
    db.commit()
    db.refresh(devis)

    # 3️⃣ créer automatiquement la quittance
    quittance = Quittance(
        fk_devis_id=devis.id,
        fk_client_id=police.fk_client_id,  # ✅ ICI
        fk_vehicule_id=devis.fk_vehicule_id,
        prime_total=devis.prime_total,
        montant_encaisse=0,
        solde=devis.prime_total,
        mode_paiement="",
    )

    db.add(quittance)
    db.commit()

    return devis


# ===================== UPDATE =====================
@router.put("/update/{devis_id}", response_model=DevisResponse)
def update_devis(devis_id: int, data: DevisUpdate, db: Session = Depends(get_db)):

    devis = db.query(Devis).filter(Devis.id == devis_id).first()
    if not devis:
        raise HTTPException(status_code=404, detail="Devis not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(devis, key, value)

    # mise à jour automatique de la quittance
    if devis.quittance:
        devis.quittance.prime_total = devis.prime_total
        devis.quittance.solde = devis.prime_total - devis.quittance.montant_encaisse

    db.commit()
    db.refresh(devis)
    return devis


# ===================== DELETE (ADMIN) =====================
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
