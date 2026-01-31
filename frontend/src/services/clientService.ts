// services/clientService.ts
import api from "../lib/api";
import { Client, ClientCreate, ClientUpdate } from "../types/client";

class ClientService {
  // Récupérer tous les clients
  async getAllClients(): Promise<Client[]> {
    const response = await api.get<Client[]>("/client/all");
    return response.data;
  }

  // Créer un client
  async createClient(clientData: ClientCreate): Promise<Client> {
    const response = await api.post<Client>("/client/create", clientData);
    return response.data;
  }

  // Mettre à jour un client
  async updateClient(clientId: number, clientData: ClientUpdate): Promise<Client> {
    const response = await api.put<Client>(`/client/update/${clientId}`, clientData);
    return response.data;
  }

  // Supprimer un client
  async deleteClient(clientId: number): Promise<void> {
    await api.delete(`/client/delete/${clientId}`);
  }
}

export const clientService = new ClientService();