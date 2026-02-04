export interface Devis {
  id: number;
  num_devis: string;
  prime_total: number;
  date_effet: string;
  date_echeance: string;
  statut: 'en_attente' | 'accepte' | 'refuse' | 'expire';
  fk_client_id: number;
  fk_vehicule_id: number;
  fk_police_id: number;
  created_at: string;
  client?: {
    id: number;
    nom_complet: string;
    cin: string;
    ville: string;
  };
  vehicule?: {
    id: number;
    matricule: string;
    marque: string;
    modele: string;
    annee: number;
  };
  police?: {
    id: number;
    num_police: string;
    date_souscription: string;
  };
  quittance?: {
    id: number;
    prime_total: number;
    solde: number;
    montant_encaisse: number;
  };
}

export interface DevisCreate {
  num_devis: string;
  prime_total: number;
  date_effet: string;
  date_echeance: string;
  statut: string;
  fk_client_id: number;
  fk_vehicule_id: number;
  fk_police_id: number;
}

export interface DevisUpdate {
  num_devis?: string;
  prime_total?: number;
  date_effet?: string;
  date_echeance?: string;
  statut?: string;
  fk_client_id?: number;
  fk_vehicule_id?: number;
  fk_police_id?: number;
}

export interface DevisFormData {
  num_devis: string;
  prime_total: number;
  date_effet: string;
  date_echeance: string;
  statut: string;
  fk_client_id: number;
  fk_vehicule_id: number;
  fk_police_id: number;
}

export interface DevisStats {
  total: number;
  en_attente: number;
  accepte: number;
  refuse: number;
  expire: number;
  total_montant: number;
}
