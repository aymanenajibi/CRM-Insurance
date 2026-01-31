// stores/clientStore.ts
import { create } from 'zustand';
import { Client, ClientCreate, ClientUpdate } from '../types/client';
import { clientService } from '../services/clientService';

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  selectedClient: Client | null;
  
  // Actions
  fetchClients: () => Promise<void>;
  createClient: (clientData: ClientCreate) => Promise<void>;
  updateClient: (clientId: number, clientData: ClientUpdate) => Promise<void>;
  deleteClient: (clientId: number) => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  clearError: () => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  loading: false,
  error: null,
  selectedClient: null,

  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const clients = await clientService.getAllClients();
      set({ clients, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors du chargement des clients",
        loading: false 
      });
    }
  },

  createClient: async (clientData: ClientCreate) => {
    set({ loading: true, error: null });
    try {
      const newClient = await clientService.createClient(clientData);
      set(state => ({ 
        clients: [...state.clients, newClient],
        loading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors de la création",
        loading: false 
      });
      throw error;
    }
  },

  updateClient: async (clientId: number, clientData: ClientUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedClient = await clientService.updateClient(clientId, clientData);
      set(state => ({
        clients: state.clients.map(client => 
          client.id === clientId ? updatedClient : client
        ),
        loading: false,
        selectedClient: null
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors de la mise à jour",
        loading: false 
      });
      throw error;
    }
  },

  deleteClient: async (clientId: number) => {
    set({ loading: true, error: null });
    try {
      await clientService.deleteClient(clientId);
      set(state => ({
        clients: state.clients.filter(client => client.id !== clientId),
        loading: false,
        selectedClient: null
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors de la suppression",
        loading: false 
      });
      throw error;
    }
  },

  setSelectedClient: (client: Client | null) => {
    set({ selectedClient: client });
  },

  clearError: () => {
    set({ error: null });
  }
}));