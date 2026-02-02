from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.police import Police
from app.models.client import Client
from app.schemas.police import (
    PoliceCreate,
    PoliceUpdate,
    PoliceResponse
)
from app.dependencies import get_current_user, admin_only
from app.models.user import User

router = APIRouter(prefix="/police", tags=["Police"])

# ==========================================
# GET ALL POLICIES
# police/all
# ==========================================
@router.get("/all", response_model=List[PoliceResponse])
def get_all_polices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les contrats de police d'assurance"""
    return db.query(Police).all()

# ==========================================
# CREATE POLICIE
# police/create
# ==========================================
@router.post("/create", response_model=PoliceResponse, status_code=201)
def create_police(
    data: PoliceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un contrat de police lié à un client existant"""
    # Vérifier si le client existe
    client = db.query(Client).filter(Client.id == data.fk_client_id).first()
    if not client:
        raise HTTPException(
            status_code=404,
            detail=f"Le client avec l'ID {data.fk_client_id} n'existe pas."
        )

    # Vérifier si le numéro de police est déjà utilisé
    existing_police = db.query(Police).filter(Police.num_police == data.num_police).first()
    if existing_police:
        raise HTTPException(
            status_code=400,
            detail="Ce numéro de police existe déjà."
        )

    new_police = Police(
        num_police=data.num_police,
        date_souscription=data.date_souscription,
        fk_client_id=data.fk_client_id
    )

    db.add(new_police)
    db.commit()
    db.refresh(new_police)
    return new_police

# ==========================================
# UPDATE POLICIE
# police/update
# ==========================================
@router.put("/update/{police_id}", response_model=PoliceResponse)
def update_police(
    police_id: int,
    data: PoliceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Modifie les informations d'une police"""
    police = db.query(Police).filter(Police.id == police_id).first()

    if not police:
        raise HTTPException(status_code=404, detail="Contrat de police introuvable")

    if data.fk_client_id:
        client = db.query(Client).filter(Client.id == data.fk_client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Nouveau client introuvable")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(police, key, value)

    db.commit()
    db.refresh(police)
    return police

# ==========================================
# DELETE POLICIE (ADMIN ONLY)
# police/delete
# ==========================================
@router.delete("/delete/{police_id}")
def delete_police(
    police_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_only)
):
    """Supprime une police (Action réservée aux administrateurs)"""
    police = db.query(Police).filter(Police.id == police_id).first()

    if not police:
        raise HTTPException(status_code=404, detail="Police introuvable")

    db.delete(police)
    db.commit()
    return {"message": f"La police n°{police.num_police} a été supprimée avec succès."}
