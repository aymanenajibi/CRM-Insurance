import api from "../lib/api";
import { Vehicule, VehiculeCreate, VehiculeUpdate } from "../types/vehicule";

class VehiculeService {
  // Récupérer tous les véhicules
  async getAllVehicules(): Promise<Vehicule[]> {
    const response = await api.get<Vehicule[]>("/vehicules/");
    return response.data;
  }

  // Créer un véhicule
  async createVehicule(vehiculeData: VehiculeCreate): Promise<Vehicule> {
    const response = await api.post<Vehicule>("/vehicules/", vehiculeData);
    return response.data;
  }

  // Récupérer un véhicule par ID
  async getVehiculeById(vehiculeId: number): Promise<Vehicule> {
    const response = await api.get<Vehicule>(`/vehicules/${vehiculeId}`);
    return response.data;
  }

  // Mettre à jour un véhicule
  async updateVehicule(vehiculeId: number, vehiculeData: VehiculeUpdate): Promise<Vehicule> {
    const response = await api.put<Vehicule>(`/vehicules/${vehiculeId}`, vehiculeData);
    return response.data;
  }

  // Supprimer un véhicule
  async deleteVehicule(vehiculeId: number): Promise<void> {
    await api.delete(`/vehicules/${vehiculeId}`);
  }
}

export const vehiculeService = new VehiculeService();