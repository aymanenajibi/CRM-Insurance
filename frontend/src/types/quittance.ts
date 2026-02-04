export interface Quittance {
  id: number;
  prime_total: number;
  montant_encaisse: number;
  solde: number;
  mode_paiement: string;
  fk_devis_id: number;
  fk_vehicule_id: number;
  fk_client_id: number;
  devis?: {
    id: number;
    prime_total: number;
    date_effet: string;
    date_echeance: string;
  };
  client?: {
    id: number;
    nom_complet: string;
  };
  vehicule?: {
    id: number;
    matricule: string;
  };
}

export interface QuittanceCreate {
  fk_devis_id: number;
  fk_vehicule_id: number;
  fk_client_id: number;
  prime_total: number;
  montant_encaisse: number;
  solde: number;
  mode_paiement: string;
}

export interface QuittanceUpdate {
  montant_encaisse?: number;
  mode_paiement?: string;
}

export interface QuittanceFormData {
  fk_devis_id: number;
  fk_vehicule_id: number;
  fk_client_id: number;
  prime_total: number;
  montant_encaisse: number;
  solde: number;
  mode_paiement: string;
}

export interface PaymentData {
  montant: number;
  methode: string;
}

export interface PaymentCreate {
  montant: number;
  methode: string;
}
