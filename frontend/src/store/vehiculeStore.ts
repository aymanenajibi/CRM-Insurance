// frontend/src/store/vehiculeStore.ts
import { create } from "zustand";
import { Vehicule, VehiculeCreate, VehiculeUpdate } from "../types/vehicule";
import { vehiculeService } from "../services/vehiculeService";

interface VehiculeState {
  vehicules: Vehicule[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVehicules: () => Promise<void>;
  addVehicule: (data: VehiculeCreate) => Promise<void>;
  updateVehicule: (id: number, data: VehiculeUpdate) => Promise<void>;
  deleteVehicule: (id: number) => Promise<void>;
}

export const useVehiculeStore = create<VehiculeState>((set, get) => ({
  vehicules: [],
  isLoading: false,
  error: null,

  fetchVehicules: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await vehiculeService.getAllVehicules();
      set({ vehicules: data, isLoading: false });
    } catch (err: any) {
      set({ error: "Erreur lors du chargement des véhicules", isLoading: false });
    }
  },

  addVehicule: async (data: VehiculeCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newVehicule = await vehiculeService.createVehicule(data);
      set((state) => ({ 
        vehicules: [...state.vehicules, newVehicule], 
        isLoading: false 
      }));
    } catch (err: any) {
      set({ error: "Erreur lors de l'ajout du véhicule", isLoading: false });
      throw err; 
    }
  },

  updateVehicule: async (id: number, data: VehiculeUpdate) => {
    set({ isLoading: true });
    try {
      const updated = await vehiculeService.updateVehicule(id, data);
      set((state) => ({
        vehicules: state.vehicules.map((v) => (v.id === id ? updated : v)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: "Erreur lors de la mise à jour", isLoading: false });
    }
  },

  deleteVehicule: async (id: number) => {
    try {
      await vehiculeService.deleteVehicule(id);
      set((state) => ({
        vehicules: state.vehicules.filter((v) => v.id !== id),
      }));
    } catch (err: any) {
      set({ error: "Erreur lors de la suppression" });
    }
  },
}));