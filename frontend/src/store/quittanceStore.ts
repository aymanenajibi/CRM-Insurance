import { create } from 'zustand';
import {
  Quittance,
  QuittanceCreate,
  QuittanceUpdate,
  PaymentData,
  QuittanceUpdateStatus
} from '../types/quittance';
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
  updatePaymentStatus: (quittanceId: number, statusData: QuittanceUpdateStatus) => Promise<void>;
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

      // Si l'API ne retourne pas les relations, enrichir les données localement
      const quittancesWithRelations = await Promise.all(
        response.data.map(async (quittance: any) => {
          // Si l'API retourne déjà les relations
          if (quittance.devis && quittance.devis.num_devis) {
            return quittance;
          }

          // Sinon, chercher le devis correspondant
          const { devis } = get();
          const relatedDevis = devis.find(d => d.id === quittance.fk_devis_id);

          // Chercher le client et véhicule si besoin
          const relatedClient = get().clients.find(c => c.id === quittance.fk_client_id);
          const relatedVehicule = get().vehicules.find(v => v.id === quittance.fk_vehicule_id);

          return {
            ...quittance,
            devis: relatedDevis || {
              id: quittance.fk_devis_id,
              num_devis: `DEV-${quittance.fk_devis_id}`
            },
            client: relatedClient || undefined,
            vehicule: relatedVehicule || undefined
          };
        })
      );

      set({ quittances: quittancesWithRelations, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors du chargement des quittances",
        loading: false
      });
    }
  },

  fetchDevis: async () => {
    try {
      const response = await api.get('/devis/all');
      const devis = response.data;
      set({ devis });
      return devis;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erreur lors du chargement des devis";
      set({ error: errorMessage });
      throw error;
    }
  },

  fetchClients: async () => {
    try {
      const response = await api.get('/client/all');
      const clients = response.data;
      set({ clients });
      return clients;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erreur lors du chargement des clients";
      set({ error: errorMessage });
      throw error;
    }
  },

  fetchVehicules: async () => {
    try {
      const response = await api.get('/vehicules/');
      const vehicules = response.data;
      set({ vehicules });
      return vehicules;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erreur lors du chargement des véhicules";
      set({ error: errorMessage });
      throw error;
    }
  },

  createQuittance: async (quittanceData: QuittanceCreate) => {
    set({ loading: true, error: null });
    try {
      throw new Error("Les quittances sont créées automatiquement avec les devis. Créez d'abord un devis.");
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Les quittances sont créées automatiquement avec les devis. Créez d'abord un devis.",
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

      // Récupérer les données du devis pour enrichir
      const { devis } = get();
      const relatedDevis = devis.find(d => d.id === updatedQuittance.fk_devis_id);

      const enrichedQuittance = {
        ...updatedQuittance,
        devis: relatedDevis || {
          id: updatedQuittance.fk_devis_id,
          num_devis: `DEV-${updatedQuittance.fk_devis_id}`
        }
      };

      set(state => ({
        quittances: state.quittances.map(quittance =>
          quittance.id === quittanceId ? enrichedQuittance : quittance
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

  enregistrerPaiement: async (quittanceId: number, paymentData: PaymentData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/quittance/encaisser/${quittanceId}`, paymentData);

      // Mise à jour optimiste de l'état local
      set(state => ({
        quittances: state.quittances.map(quittance => {
          if (quittance.id === quittanceId) {
            const nouveauMontantEncaisse = quittance.montant_encaisse + paymentData.montant_encaisse;
            const nouveauSolde = Math.max(0, quittance.solde - paymentData.montant_encaisse);

            // Déterminer le nouveau statut automatiquement
            let nouveauStatut = quittance.statut_paiement;
            if (nouveauSolde === 0) {
              nouveauStatut = "payé";
            } else if (nouveauMontantEncaisse > 0) {
              nouveauStatut = "partiel";
            } else {
              nouveauStatut = "impayé";
            }

            return {
              ...quittance,
              montant_encaisse: nouveauMontantEncaisse,
              solde: nouveauSolde,
              mode_paiement: paymentData.mode_paiement,
              statut_paiement: nouveauStatut
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

  updatePaymentStatus: async (quittanceId: number, statusData: QuittanceUpdateStatus) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/quittance/update-status/${quittanceId}`, statusData);

      // Mise à jour optimiste de l'état local
      set(state => ({
        quittances: state.quittances.map(quittance => {
          if (quittance.id === quittanceId) {
            return {
              ...quittance,
              statut_paiement: statusData.statut_paiement,
              ...(statusData.montant_encaisse !== undefined && {
                montant_encaisse: statusData.montant_encaisse
              }),
              ...(statusData.solde !== undefined && {
                solde: statusData.solde
              })
            };
          }
          return quittance;
        }),
        loading: false
      }));

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Erreur lors de la mise à jour du statut",
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
