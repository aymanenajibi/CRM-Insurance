import { Client } from "./client";

export interface Vehicule {
  id: number;
  matricule: string;
  marque: string;
  model: string;
  date_mise_en_circulation: string; 
  valeur_venale: number;
  puissance_fiscale: number;
  fk_client_id?: number;
  client?: Client;
}

export interface VehiculeCreate {
  matricule: string;
  marque: string;
  model: string;
  date_mise_en_circulation: string; 
  valeur_venale: number;
  puissance_fiscale: number;
  fk_client_id?: number;
}
export interface VehiculeUpdate {
  matricule: string;
  marque: string;
  model: string;
  date_mise_en_circulation: string; 
  valeur_venale: number;
  puissance_fiscale: number;
  fk_client_id?: number;
}