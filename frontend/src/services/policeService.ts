import api from "../lib/api";
import { Police, PoliceCreate, PoliceUpdate } from "../types/police";

class PoliceService {
  // Récupérer toutes les polices
  async getAllPolices(): Promise<Police[]> {
    const response = await api.get<Police[]>("/police/all");
    return response.data;
  }

  // Créer une police
  async createPolice(policeData: PoliceCreate): Promise<Police> {
    const response = await api.post<Police>("/police/create", policeData);
    return response.data;
  }

  // Mettre à jour une police
  async updatePolice(policeId: number, policeData: PoliceUpdate): Promise<Police> {
    const response = await api.put<Police>(`/police/update/${policeId}`, policeData);
    return response.data;
  }

  // Supprimer une police
  async deletePolice(policeId: number): Promise<void> {
    await api.delete(`/police/delete/${policeId}`);
  }
}

export const policeService = new PoliceService();
