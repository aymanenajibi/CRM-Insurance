import { create } from 'zustand';
import { devisService } from '../services/devisService';
import {
  Devis,
  DevisCreate,
  DevisUpdate,
  DevisFormData,
  DevisStats
} from '../types/devis';
import { Client } from '../types/client';
import { Vehicule } from '../types/vehicule';
import { Police } from '../types/police';
import api from '../lib/api';

interface DevisState {
  // États
  devis: Devis[];
  filteredDevis: Devis[];
  clients: Client[];
  vehicules: Vehicule[];
  polices: Police[];
  stats: DevisStats | null;
  loading: boolean;
  error: string | null;
  selectedDevis: Devis | null;
  searchQuery: string;
  filterStatus: string | null;

  // Actions
  // Fetch
  fetchDevis: () => Promise<void>;
  fetchClients: () => Promise<Client[]>;
  fetchVehicules: () => Promise<Vehicule[]>;
  fetchPolices: () => Promise<Police[]>;
  fetchStats: () => Promise<void>;

  // CRUD
  createDevis: (devisData: DevisCreate) => Promise<void>;
  updateDevis: (devisId: number, devisData: DevisUpdate) => Promise<void>;
  deleteDevis: (devisId: number) => Promise<void>;

  // Actions spécifiques
  genererQuittance: (devisId: number) => Promise<void>;
  exportDevisPDF: (devisId: number) => Promise<void>;
  sendDevisEmail: (devisId: number, email: string) => Promise<void>;

  // Recherche et filtres
  searchDevis: (query: string) => Promise<void>;
  filterDevisByStatus: (status: string | null) => void;
  clearFilters: () => void;

  // Gestion état
  setSelectedDevis: (devis: Devis | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string | null) => void;
  clearError: () => void;

  // Utilitaires
  getDevisById: (id: number) => Devis | undefined;
  calculateDevisStats: () => DevisStats;
}

export const useDevisStore = create<DevisState>((set, get) => ({
  // États initiaux
  devis: [],
  filteredDevis: [],
  clients: [],
  vehicules: [],
  polices: [],
  stats: null,
  loading: false,
  error: null,
  selectedDevis: null,
  searchQuery: '',
  filterStatus: null,

  // ========== FETCH ACTIONS ==========

  fetchDevis: async () => {
    set({ loading: true, error: null });
    try {
      const devis = await devisService.getAllDevis();
      set({
        devis,
        filteredDevis: devis,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors du chargement des devis",
        loading: false
      });
    }
  },

  fetchClients: async () => {
    try {
      const response = await api.get<Client[]>('/client/all');
      const clients = response.data;
      set({ clients });
      return clients;
    } catch (error: any) {
      throw new Error("Erreur lors du chargement des clients");
    }
  },

  fetchVehicules: async () => {
    try {
      const response = await api.get<Vehicule[]>('/vehicules/');
      const vehicules = response.data;
      set({ vehicules });
      return vehicules;
    } catch (error: any) {
      throw new Error("Erreur lors du chargement des véhicules");
    }
  },

  fetchPolices: async () => {
    try {
      const response = await api.get<Police[]>('/police/all');
      const polices = response.data;
      set({ polices });
      return polices;
    } catch (error: any) {
      throw new Error("Erreur lors du chargement des polices");
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await devisService.getDevisStats();
      set({ stats, loading: false });
    } catch (error: any) {
      // Si l'endpoint stats n'existe pas, calculer localement
      const { devis } = get();
      const localStats = get().calculateDevisStats();
      set({ stats: localStats, loading: false });
    }
  },

  // ========== CRUD ACTIONS ==========

  createDevis: async (devisData: DevisCreate) => {
    set({ loading: true, error: null });
    try {
      const newDevis = await devisService.createDevis(devisData);
      set(state => ({
        devis: [...state.devis, newDevis],
        filteredDevis: [...state.filteredDevis, newDevis],
        loading: false
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la création du devis",
        loading: false
      });
      throw error;
    }
  },

  updateDevis: async (devisId: number, devisData: DevisUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedDevis = await devisService.updateDevis(devisId, devisData);
      set(state => ({
        devis: state.devis.map(devis =>
          devis.id === devisId ? updatedDevis : devis
        ),
        filteredDevis: state.filteredDevis.map(devis =>
          devis.id === devisId ? updatedDevis : devis
        ),
        loading: false,
        selectedDevis: null
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la mise à jour du devis",
        loading: false
      });
      throw error;
    }
  },

  deleteDevis: async (devisId: number) => {
    set({ loading: true, error: null });
    try {
      await devisService.deleteDevis(devisId);
      set(state => ({
        devis: state.devis.filter(devis => devis.id !== devisId),
        filteredDevis: state.filteredDevis.filter(devis => devis.id !== devisId),
        loading: false,
        selectedDevis: null
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la suppression du devis",
        loading: false
      });
      throw error;
    }
  },

  // ========== SPECIFIC ACTIONS ==========

  genererQuittance: async (devisId: number) => {
    set({ loading: true, error: null });
    try {
      const result = await devisService.genererQuittance(devisId);

      // Mettre à jour le devis pour refléter qu'il a maintenant une quittance
      set(state => ({
        devis: state.devis.map(devis => {
          if (devis.id === devisId) {
            return {
              ...devis,
              quittance: {
                id: result.quittance_id,
                prime_total: devis.prime_total,
                solde: devis.prime_total,
                montant_encaisse: 0
              }
            };
          }
          return devis;
        }),
        loading: false
      }));

      return result;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la génération de la quittance",
        loading: false
      });
      throw error;
    }
  },

  exportDevisPDF: async (devisId: number) => {
    set({ loading: true, error: null });
    try {
      const blob = await devisService.exportDevisToPDF(devisId);

      // Créer un lien pour télécharger le PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis-${devisId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de l'export PDF",
        loading: false
      });
      throw error;
    }
  },

  sendDevisEmail: async (devisId: number, email: string) => {
    set({ loading: true, error: null });
    try {
      await devisService.sendDevisByEmail(devisId, email);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de l'envoi par email",
        loading: false
      });
      throw error;
    }
  },

  // ========== SEARCH & FILTER ACTIONS ==========

  searchDevis: async (query: string) => {
    set({ loading: true, error: null, searchQuery: query });
    try {
      if (query.trim() === '') {
        // Si la recherche est vide, réinitialiser
        const { devis, filterStatus } = get();
        let filtered = devis;

        if (filterStatus) {
          filtered = devis.filter(devis => devis.statut === filterStatus);
        }

        set({ filteredDevis: filtered, loading: false });
      } else {
        // Recherche via API ou localement
        try {
          const results = await devisService.searchDevis(query);
          set({ filteredDevis: results, loading: false });
        } catch {
          // Fallback: recherche locale
          const { devis } = get();
          const filtered = devis.filter(devis =>
            devis.num_devis.toLowerCase().includes(query.toLowerCase()) ||
            devis.client?.nom_complet.toLowerCase().includes(query.toLowerCase()) ||
            devis.vehicule?.matricule.toLowerCase().includes(query.toLowerCase())
          );
          set({ filteredDevis: filtered, loading: false });
        }
      }
    } catch (error: any) {
      set({
        error: "Erreur lors de la recherche",
        loading: false
      });
    }
  },

  filterDevisByStatus: (status: string | null) => {
    set({ filterStatus: status, loading: true });

    const { devis, searchQuery } = get();
    let filtered = devis;

    // Appliquer le filtre de statut
    if (status) {
      filtered = filtered.filter(devis => devis.statut === status);
    }

    // Appliquer la recherche si elle existe
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(devis =>
        devis.num_devis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devis.client?.nom_complet.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    set({ filteredDevis: filtered, loading: false });
  },

  clearFilters: () => {
    const { devis } = get();
    set({
      filteredDevis: devis,
      searchQuery: '',
      filterStatus: null
    });
  },

  // ========== STATE MANAGEMENT ==========

  setSelectedDevis: (devis: Devis | null) => {
    set({ selectedDevis: devis });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setFilterStatus: (status: string | null) => {
    set({ filterStatus: status });
  },

  clearError: () => {
    set({ error: null });
  },

  // ========== UTILITIES ==========

  getDevisById: (id: number) => {
    const { devis } = get();
    return devis.find(devis => devis.id === id);
  },

  calculateDevisStats: () => {
    const { devis } = get();

    const stats: DevisStats = {
      total: devis.length,
      en_attente: devis.filter(d => d.statut === 'en_attente').length,
      accepte: devis.filter(d => d.statut === 'accepte').length,
      refuse: devis.filter(d => d.statut === 'refuse').length,
      expire: devis.filter(d => d.statut === 'expire').length,
      total_montant: devis.reduce((sum, devis) => sum + devis.prime_total, 0)
    };

    return stats;
  }
}));
