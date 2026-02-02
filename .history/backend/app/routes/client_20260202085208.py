from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse
from app.dependencies import get_current_user, admin_only
from app.models.user import User

router = APIRouter(prefix="/client", tags=["Client"])


# =========================
# GET ALL CLIENTS
# client/all
# =========================
@router.get("/all", response_model=List[ClientResponse])
def get_all_clients(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(Client).all()


# =========================
# CREATE CLIENT
# client/create
# =========================
@router.post("/create", response_model=ClientResponse, status_code=201)
def create_client(
    data: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = Client(
        nom_complet=data.nom_complet,
        cin=data.cin,
        date_naissance=data.date_naissance,
        ville=data.ville,
        type_permis=data.type_permis,
    )

    db.add(client)
    db.commit()
    db.refresh(client)
    return client


# =========================
# UPDATE CLIENT
# client/update
# =========================
@router.put("/update/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int,
    data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(client, key, value)

    db.commit()
    db.refresh(client)
    return client


# =========================
# DELETE CLIENT (ADMIN ONLY)
# client/delete
# =========================
@router.delete("/delete/{client_id}")
def delete_client(
    client_id: int, db: Session = Depends(get_db), admin: User = Depends(admin_only)
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    db.delete(client)
    db.commit()
    return {"message": "Client deleted successfully"}
