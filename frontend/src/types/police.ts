export interface Police {
  id: number;
  num_police: string;
  date_souscription: string;
  fk_client_id: number;
  client?: {
    id: number;
    nom_complet: string;
  };
}

export interface PoliceCreate {
  num_police: string;
  date_souscription: string;
  fk_client_id: number;
}

export interface PoliceUpdate {
  num_police?: string;
  date_souscription?: string;
  fk_client_id?: number;
}

export interface PoliceFormData {
  num_police: string;
  date_souscription: string;
  fk_client_id: number;
}
