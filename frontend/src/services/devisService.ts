import api from "../lib/api";
import { Devis, DevisCreate, DevisUpdate, DevisStats } from "../types/devis";

class DevisService {
  async getAllDevis(): Promise<Devis[]> {
    const response = await api.get<Devis[]>("/devis/all");
    return response.data;
  }

  async getDevisById(id: number): Promise<Devis> {
    const response = await api.get<Devis>(`/devis/${id}`);
    return response.data;
  }

  async createDevis(devisData: DevisCreate): Promise<Devis> {
    const response = await api.post<Devis>("/devis/create", devisData);
    return response.data;
  }

  async updateDevis(devisId: number, devisData: DevisUpdate): Promise<Devis> {
    const response = await api.put<Devis>(`/devis/update/${devisId}`, devisData);
    return response.data;
  }

  async deleteDevis(devisId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/devis/delete/${devisId}`);
    return response.data;
  }

  async genererQuittance(devisId: number): Promise<{ message: string; quittance_id: number }> {
    const response = await api.post<{ message: string; quittance_id: number }>(
      `/devis/${devisId}/generer-quittance`
    );
    return response.data;
  }

  async getDevisStats(): Promise<DevisStats> {
    const response = await api.get<DevisStats>("/devis/stats");
    return response.data;
  }

  async searchDevis(query: string): Promise<Devis[]> {
    const response = await api.get<Devis[]>(`/devis/search?q=${query}`);
    return response.data;
  }

  async filterDevisByStatus(status: string): Promise<Devis[]> {
    const response = await api.get<Devis[]>(`/devis/filter?status=${status}`);
    return response.data;
  }

  async exportDevisToPDF(devisId: number): Promise<Blob> {
    const response = await api.get(`/devis/${devisId}/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async sendDevisByEmail(devisId: number, email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/devis/${devisId}/send-email`, { email });
    return response.data;
  }
}

export const devisService = new DevisService();
