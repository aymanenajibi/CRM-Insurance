from pydantic import BaseModel
from typing import List, Optional

class MetricCard(BaseModel):
    title: str
    value: str
    trend: float
    trend_type: str
    description: str
    iconName: str 

class ChartDataPoint(BaseModel):
    label: str
    revenue: float
    collected: float

class DistributionPoint(BaseModel):
    name: str
    value: int
    
class PendingPayment(BaseModel):
    id: int
    client_name: str
    prime_total: float
    solde: float
    mode_paiement: Optional[str] = "N/A"

class DashboardStatsResponse(BaseModel):
    cards: List[MetricCard]
    main_chart: List[ChartDataPoint]
    distribution_chart: List[DistributionPoint]
    pending_payments: List[PendingPayment]