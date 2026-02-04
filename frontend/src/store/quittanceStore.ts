import { create } from 'zustand';
import { Quittance, QuittanceCreate, QuittanceUpdate, PaymentData, PaymentFrontendData } from '../types/quittance';
import { Devis } from '../types/devis';
import { Client } from '../types/client';
import { Vehicule } from '../types/vehicule';
import api from '../lib/api';

interface QuittanceState {
  quittances: Quittance[];
  devis: Devis[];
  clients: Client[];
  vehicules: Vehicule[];
  loading: boolean;
  error: string | null;
  selectedQuittance: Quittance | null;

  // Actions
  fetchQuittances: () => Promise<void>;
  fetchDevis: () => Promise<Devis[]>;
  fetchClients: () => Promise<Client[]>;
  fetchVehicules: () => Promise<Vehicule[]>;
  createQuittance: (quittanceData: QuittanceCreate) => Promise<void>;
  updateQuittance: (quittanceId: number, quittanceData: QuittanceUpdate) => Promise<void>;
  deleteQuittance: (quittanceId: number) => Promise<void>;
  enregistrerPaiement: (quittanceId: number, paymentData: PaymentData) => Promise<void>;
  setSelectedQuittance: (quittance: Quittance | null) => void;
  clearError: () => void;
}

export const useQuittanceStore = create<QuittanceState>((set, get) => ({
  quittances: [],
  devis: [],
  clients: [],
  vehicules: [],
  loading: false,
  error: null,
  selectedQuittance: null,

  fetchQuittances: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/quittance/all');
      set({ quittances: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors du chargement des quittances",
        loading: false
      });
    }
  },

  fetchDevis: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/devis/all');
      const devis = response.data;
      set({ devis, loading: false });
      return devis;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors du chargement des devis",
        loading: false
      });
      throw error;
    }
  },

  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/client/all');
      const clients = response.data;
      set({ clients, loading: false });
      return clients;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors du chargement des clients",
        loading: false
      });
      throw error;
    }
  },

  fetchVehicules: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/vehicules/');
      const vehicules = response.data;
      set({ vehicules, loading: false });
      return vehicules;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors du chargement des véhicules",
        loading: false
      });
      throw error;
    }
  },

  createQuittance: async (quittanceData: QuittanceCreate) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/quittance/create', quittanceData);
      const newQuittance = response.data;
      set(state => ({
        quittances: [...state.quittances, newQuittance],
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

  updateQuittance: async (quittanceId: number, quittanceData: QuittanceUpdate) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/quittance/update/${quittanceId}`, quittanceData);
      const updatedQuittance = response.data;
      set(state => ({
        quittances: state.quittances.map(quittance =>
          quittance.id === quittanceId ? updatedQuittance : quittance
        ),
        loading: false,
        selectedQuittance: null
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la mise à jour",
        loading: false
      });
      throw error;
    }
  },

  deleteQuittance: async (quittanceId: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/quittance/delete/${quittanceId}`);
      set(state => ({
        quittances: state.quittances.filter(quittance => quittance.id !== quittanceId),
        loading: false,
        selectedQuittance: null
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la suppression",
        loading: false
      });
      throw error;
    }
  },

  enregistrerPaiement: async (quittanceId: number, paymentFrontendData: PaymentFrontendData) => {
    set({ loading: true, error: null });
    try {
      const paymentBackendData: PaymentData = {
        montant: paymentFrontendData.montant_encaisse,
        methode: paymentFrontendData.mode_paiement
      };

      const response = await api.post(`/quittance/paiement/${quittanceId}`, paymentBackendData);

      set(state => ({
        quittances: state.quittances.map(quittance => {
          if (quittance.id === quittanceId) {
            return {
              ...quittance,
              montant_encaisse: quittance.montant_encaisse + paymentFrontendData.montant_encaisse,
              solde: quittance.solde - paymentFrontendData.montant_encaisse,
              mode_paiement: paymentFrontendData.mode_paiement
            };
          }
          return quittance;
        }),
        loading: false
      }));

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de l'enregistrement du paiement",
        loading: false
      });
      throw error;
    }
  },

  setSelectedQuittance: (quittance: Quittance | null) => {
    set({ selectedQuittance: quittance });
  },

  clearError: () => {
    set({ error: null });
  }
}));
