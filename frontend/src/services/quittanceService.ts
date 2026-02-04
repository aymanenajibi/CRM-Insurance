import api from "../lib/api";
import { Quittance, QuittanceCreate, QuittanceUpdate, PaymentData } from "../types/quittance";

class QuittanceService {
  async getAllQuittances(): Promise<Quittance[]> {
    const response = await api.get<Quittance[]>("/quittance/all");
    return response.data;
  }

  async createQuittance(quittanceData: QuittanceCreate): Promise<Quittance> {
    const response = await api.post<Quittance>("/quittance/create", quittanceData);
    return response.data;
  }

  async enregistrerPaiement(quittanceId: number, paymentData: PaymentData): Promise<Quittance> {
    const response = await api.post<Quittance>(`/quittance/paiement/${quittanceId}`, paymentData);
    return response.data;
  }

  async deleteQuittance(quittanceId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/quittance/delete/${quittanceId}`);
    return response.data;
  }

  async updateQuittance(quittanceId: number, quittanceData: QuittanceUpdate): Promise<Quittance> {
    const response = await api.put<Quittance>(`/quittance/update/${quittanceId}`, quittanceData);
    return response.data;
  }

  async getPaiementsQuittance(quittanceId: number): Promise<any[]> {
    const response = await api.get(`/quittance/${quittanceId}/paiements`);
    return response.data;
  }
}

export const quittanceService = new QuittanceService();
