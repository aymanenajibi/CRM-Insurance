export interface Vehicule {
  id: number;
  matricule: string;
  marque: string;
  model: string;
  date_mise_circulation: string;
  valeur_venale: number;
  puissance_fiscale: number;
}

export type VehiculeCreate = Omit<Vehicule, 'id'>;