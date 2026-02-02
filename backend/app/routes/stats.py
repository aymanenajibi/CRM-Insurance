from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.client import Client
from app.models.police import Police
from app.schemas.stats import DashboardStatsResponse
from app.models.quittance import Quittance 
from app.models.vehicule import Vehicule
from app.models.devis import Devis
from app.schemas.stats import PendingPayment

router = APIRouter(prefix="/stats", tags=["Statistics"])
@router.get("/", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    # 1. Financials (Still from Quittance)
    total_revenue = db.query(func.sum(Quittance.prime_total)).scalar() or 0
    total_collected = db.query(func.sum(Quittance.montant_encaisse)).scalar() or 0
    
    total_clients = db.query(Client).count()
    total_policies = db.query(Police).count()

    bar_results = db.query(
        func.to_char(Devis.date_effet, 'Mon').label("month"),
        func.sum(Quittance.prime_total).label("revenue"),
        func.sum(Quittance.montant_encaisse).label("collected")
    ).join(Quittance, Quittance.fk_devis_id == Devis.id) \
     .group_by("month").all()

    # main_chart_data = [
    #     {
    #         "label": str(r.month), 
    #         "revenue": float(r.revenue or 0), 
    #         "collected": float(r.collected or 0)
    #     } for r in bar_results if r.month is not None
    # ]
    main_chart_data = [
        {"label": "Jan", "revenue": 45000, "collected": 38000},
        {"label": "Feb", "revenue": 52000, "collected": 41000},
        {"label": "Mar", "revenue": 48000, "collected": 45000},
        {"label": "Apr", "revenue": 61000, "collected": 52000},
        {"label": "May", "revenue": 55000, "collected": 48000},
        {"label": "Jun", "revenue": 67000, "collected": 60000},
    ]

    brand_counts = db.query(
        Vehicule.marque, 
        func.count(Vehicule.id)
    ).group_by(Vehicule.marque).all()

    distribution_data = [
        {"name": str(brand) if brand else "Autres", "value": int(count)} 
        for brand, count in brand_counts
    ]
    
    unpaid_data = db.query(Quittance).filter(Quittance.solde > 0).limit(5).all()
    
    pending_payments = [
        PendingPayment(
            id=q.id,
            client_name=q.client.nom_complet if q.client else "Inconnu",
            prime_total=float(q.prime_total),
            solde=float(q.solde),
            mode_paiement=q.mode_paiement or "N/A"
        ) for q in unpaid_data
    ]


    

    return {
        "cards": [
            {
                "title": "Chiffre d'Affaires",
                "value": f"{total_revenue:,.0f} DH".replace(",", " "),
                "trend": 10.2,
                "trend_type": "up",
                "description": "Total des primes émises",
                "iconName": "dollar"
            },
            {
                "title": "Montant Encaissé",
                "value": f"{total_collected:,.0f} DH".replace(",", " "),
                "trend": 5.4,
                "trend_type": "up",
                "description": "Liquidités réelles",
                "iconName": "wallet"
            },
            {
                "title": "Clients Totaux",
                "value": str(total_clients),
                "trend": 2.1,
                "trend_type": "up",
                "description": "Portefeuille actif",
                "iconName": "users"
            },
            {
                "title": "Contrats (Polices)",
                "value": str(total_policies),
                "trend": 0.0,
                "trend_type": "neutral",
                "description": "Total des polices",
                "iconName": "file-text"
            }
        ],
        "main_chart": main_chart_data,
        "distribution_chart": distribution_data,
        "pending_payments": pending_payments
    }