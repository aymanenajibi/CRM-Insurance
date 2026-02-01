// types/client.ts
export interface Client {
  id: number;
  nom_complet: string;
  cin: string;
  date_naissance: string; 
  ville: string;
  type_permis: string;
  created_at: string;
}

export interface ClientCreate {
  nom_complet: string;
  cin: string;
  date_naissance: string;
  ville: string;
  type_permis: string;
}

export interface ClientUpdate {
  nom_complet?: string;
  cin?: string;
  date_naissance?: string;
  ville?: string;
  type_permis?: string;
}

export interface ClientFormData {
  nom_complet: string;
  cin: string;
  date_naissance: string;
  ville: string;
  type_permis: string;
}