export interface MetricCard {
  title: string;
  value: string;
  description: string;
  trend: number;
  trend_type: 'up' | 'down' | 'neutral';
  iconName: 'dollar' | 'users' | 'file-text' | 'trending-up';
}

export interface ChartDataPoint {
  label: string;
  revenue: number;   
  collected: number; 
}

export interface DistributionPoint {
  name: string;
  value: number;
}

export interface PendingPayment {
  id: number;
  client_name: string;
  prime_total: number;
  solde: number;
  mode_paiement: string;
}

export interface DashboardStatsResponse {
  cards: MetricCard[];
  main_chart: ChartDataPoint[];
  distribution_chart: DistributionPoint[];
  pending_payments: PendingPayment[];
}