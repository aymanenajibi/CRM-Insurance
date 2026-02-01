from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.vehicule import Vehicule
from app.schemas.vehicule import (
    VehiculeCreate,
    VehiculeResponse,
    VehiculeUpdate
)
from app.dependencies import get_current_user, admin_only

router = APIRouter(prefix="/vehicules", tags=["Vehicules"])


# ===================== GET ALL VEHICULES =====================
@router.get("/", response_model=List[VehiculeResponse])
def get_all_vehicules(
    db: Session = Depends(get_db), 
    # current_user=Depends(get_current_user)
):
    """Récupérer tous les véhicules"""
    return db.query(Vehicule).all()


# ===================== CREATE VEHICULE (ADMIN) =====================
@router.post("/", response_model=VehiculeResponse, status_code=status.HTTP_201_CREATED)
def create_vehicule(
    data: VehiculeCreate,
    db: Session = Depends(get_db),
    # admin=Depends(admin_only)
):
    """Créer un nouveau véhicule (admin seulement)"""
    # Vérifier l'unicité du matricule
    existing_matricule = db.query(Vehicule).filter(Vehicule.matricule == data.matricule).first()
    if existing_matricule:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce matricule est déjà enregistré"
        )

    new_vehicule = Vehicule(
        matricule=data.matricule,
        marque=data.marque,
        model=data.model,
        date_mise_en_circulation=data.date_mise_en_circulation,
        valeur_venale=data.valeur_venale,
        puissance_fiscale=data.puissance_fiscale,
        fk_client_id=data.fk_client_id,
    )
    
    db.add(new_vehicule)
    db.commit()
    db.refresh(new_vehicule)
    
    return new_vehicule


# ===================== GET VEHICULE BY ID =====================
@router.get("/{vehicule_id}", response_model=VehiculeResponse)
def get_vehicule_by_id(
    vehicule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Récupérer un véhicule par ID"""
    vehicule = db.query(Vehicule).filter(Vehicule.id == vehicule_id).first()

    if not vehicule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Véhicule non trouvé"
        )

    return vehicule


# ===================== UPDATE VEHICULE (ADMIN) =====================
@router.put("/{vehicule_id}", response_model=VehiculeResponse)
def update_vehicule(
    vehicule_id: int,
    data: VehiculeUpdate,
    db: Session = Depends(get_db),
    # admin=Depends(admin_only),
):
    """Mettre à jour un véhicule (admin seulement)"""
    vehicule = db.query(Vehicule).filter(Vehicule.id == vehicule_id).first()

    if not vehicule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Véhicule non trouvé"
        )

    # Vérifier l'unicité du matricule si celui-ci est modifié
    if data.matricule is not None and data.matricule != vehicule.matricule:
        existing_matricule = db.query(Vehicule).filter(Vehicule.matricule == data.matricule).first()
        if existing_matricule:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce matricule appartient déjà à un autre véhicule"
            )

    # Mettre à jour les champs dynamiquement
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicule, field, value)

    db.commit()
    db.refresh(vehicule)
    
    return vehicule


# ===================== DELETE VEHICULE (ADMIN) =====================
@router.delete("/{vehicule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicule(
    vehicule_id: int,
    db: Session = Depends(get_db),
    # admin=Depends(admin_only)
):
    """Supprimer un véhicule (admin seulement)"""
    vehicule = db.query(Vehicule).filter(Vehicule.id == vehicule_id).first()

    if not vehicule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Véhicule non trouvé"
        )

    db.delete(vehicule)
    db.commit()
    
    return None