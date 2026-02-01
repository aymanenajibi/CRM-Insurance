import { create } from 'zustand';
import { Police, PoliceCreate, PoliceUpdate } from '../types/police';
import { policeService } from '../services/policeService';
import { Client } from '../types/client';

interface PoliceState {
  polices: Police[];
  clients: Client[]; // Pour la liste déroulante des clients
  loading: boolean;
  error: string | null;
  selectedPolice: Police | null;

  // Actions
  fetchPolices: () => Promise<void>;
  fetchClients: () => Promise<Client[]>; // Pour charger les clients
  createPolice: (policeData: PoliceCreate) => Promise<void>;
  updatePolice: (policeId: number, policeData: PoliceUpdate) => Promise<void>;
  deletePolice: (policeId: number) => Promise<void>;
  setSelectedPolice: (police: Police | null) => void;
  clearError: () => void;
}

export const usePoliceStore = create<PoliceState>((set, get) => ({
  polices: [],
  clients: [],
  loading: false,
  error: null,
  selectedPolice: null,

  fetchPolices: async () => {
    set({ loading: true, error: null });
    try {
      const polices = await policeService.getAllPolices();
      set({ polices, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors du chargement des polices",
        loading: false
      });
    }
  },

  fetchClients: async () => {
    try {
      const response = await fetch('http://localhost:8000/client/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const clients = await response.json();
      set({ clients });
      return clients;
    } catch (error: any) {
      throw new Error("Erreur lors du chargement des clients");
    }
  },

  createPolice: async (policeData: PoliceCreate) => {
    set({ loading: true, error: null });
    try {
      const newPolice = await policeService.createPolice(policeData);
      set(state => ({
        polices: [...state.polices, newPolice],
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

  updatePolice: async (policeId: number, policeData: PoliceUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedPolice = await policeService.updatePolice(policeId, policeData);
      set(state => ({
        polices: state.polices.map(police =>
          police.id === policeId ? updatedPolice : police
        ),
        loading: false,
        selectedPolice: null
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la mise à jour",
        loading: false
      });
      throw error;
    }
  },

  deletePolice: async (policeId: number) => {
    set({ loading: true, error: null });
    try {
      await policeService.deletePolice(policeId);
      set(state => ({
        polices: state.polices.filter(police => police.id !== policeId),
        loading: false,
        selectedPolice: null
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la suppression",
        loading: false
      });
      throw error;
    }
  },

  setSelectedPolice: (police: Police | null) => {
    set({ selectedPolice: police });
  },

  clearError: () => {
    set({ error: null });
  }
}));
