from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.quittance import Quittance
from app.schemas.quittance import (
    QuittanceCreate,
    QuittanceResponse,
    QuittanceEncaissement,
)

router = APIRouter(prefix="/quittance", tags=["Quittance"])


@router.get("/all", response_model=list[QuittanceResponse])
def get_all(db: Session = Depends(get_db)):
    return db.query(Quittance).all()


@router.post("/create", response_model=QuittanceResponse)
def create(data: QuittanceCreate, db: Session = Depends(get_db)):
    q = Quittance(**data.dict(), encaissee=False)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q


@router.put("/encaisser/{id}")
def encaisser(id: int, data: QuittanceEncaissement, db: Session = Depends(get_db)):
    q = db.query(Quittance).get(id)
    if not q:
        raise HTTPException(status_code=404, detail="Quittance not found")

    q.encaissee = True
    q.date_encaissement = data.date_encaissement

    db.commit()
    return {"message": "Quittance encaissée"}


@router.delete("/delete/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    q = db.query(Quittance).get(id)
    if not q:
        raise HTTPException(status_code=404, detail="Quittance not found")

    db.delete(q)
    db.commit()
    return {"message": "Quittance supprimée"}
