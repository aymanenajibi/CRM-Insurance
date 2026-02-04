import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { DevisFormData } from "../../types/devis";
import { Client } from "../../types/client";
import { Vehicule } from "../../types/vehicule";
import { Police } from "../../types/police";

interface DevisFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DevisFormData) => Promise<void>;
  initialData?: DevisFormData;
  clients: Client[];
  vehicules: Vehicule[];
  polices: Police[];
  isEditing?: boolean;
  loading?: boolean;
}

const defaultFormData: DevisFormData = {
  num_devis: "",
  prime_total: 0,
  date_effet: "",
  date_echeance: "",
  statut: "en_attente",
  fk_client_id: 0,
  fk_vehicule_id: 0,
  fk_police_id: 0,
};

export function DevisFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  clients,
  vehicules,
  polices,
  isEditing = false,
  loading = false,
}: DevisFormModalProps) {
  const [formData, setFormData] = useState<DevisFormData>(defaultFormData);
  const [filteredVehicules, setFilteredVehicules] = useState<Vehicule[]>([]);
  const [filteredPolices, setFilteredPolices] = useState<Police[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);

  // Filtrer les véhicules quand le client change
  useEffect(() => {
    if (formData.fk_client_id && formData.fk_client_id > 0) {
      const clientVehicules = vehicules.filter(
        (vehicule) => vehicule.fk_client_id === formData.fk_client_id
      );
      setFilteredVehicules(clientVehicules);

      // Si aucun véhicule n'est sélectionné et que le client a des véhicules, sélectionner le premier
      if (clientVehicules.length > 0 && (!formData.fk_vehicule_id || formData.fk_vehicule_id === 0)) {
        setFormData(prev => ({ ...prev, fk_vehicule_id: clientVehicules[0].id }));
      }

      // Si le véhicule actuellement sélectionné n'appartient pas au nouveau client, le réinitialiser
      if (formData.fk_vehicule_id && formData.fk_vehicule_id > 0) {
        const selectedVehicule = vehicules.find(v => v.id === formData.fk_vehicule_id);
        if (selectedVehicule && selectedVehicule.fk_client_id !== formData.fk_client_id) {
          if (clientVehicules.length > 0) {
            setFormData(prev => ({ ...prev, fk_vehicule_id: clientVehicules[0].id }));
          } else {
            setFormData(prev => ({ ...prev, fk_vehicule_id: 0 }));
          }
        }
      }
    } else {
      setFilteredVehicules([]);
      if (formData.fk_vehicule_id > 0) {
        setFormData(prev => ({ ...prev, fk_vehicule_id: 0 }));
      }
    }
  }, [formData.fk_client_id, vehicules, formData.fk_vehicule_id]);

  // Filtrer et auto-sélectionner les polices quand le client change
  useEffect(() => {
    if (formData.fk_client_id && formData.fk_client_id > 0) {
      const clientPolices = polices.filter(
        (police) => police.fk_client_id === formData.fk_client_id
      );
      setFilteredPolices(clientPolices);

      // Si le client a une seule police et aucune n'est encore sélectionnée
      if (clientPolices.length === 1 && !formData.fk_police_id) {
        setFormData(prev => ({ ...prev, fk_police_id: clientPolices[0].id }));
      }

      // Si la police actuellement sélectionnée n'appartient pas au client
      if (formData.fk_police_id && formData.fk_police_id > 0) {
        const selectedPolice = polices.find(p => p.id === formData.fk_police_id);
        if (selectedPolice && selectedPolice.fk_client_id !== formData.fk_client_id) {
          const matchingPolice = clientPolices.find(p =>
            p.vehicules?.some(v => v.id === formData.fk_vehicule_id)
          );

          if (matchingPolice) {
            setFormData(prev => ({ ...prev, fk_police_id: matchingPolice.id }));
          } else if (clientPolices.length > 0) {
            setFormData(prev => ({ ...prev, fk_police_id: clientPolices[0].id }));
          } else {
            setFormData(prev => ({ ...prev, fk_police_id: 0 }));
          }
        }
      }
    } else {
      setFilteredPolices([]);
      if (formData.fk_police_id > 0) {
        setFormData(prev => ({ ...prev, fk_police_id: 0 }));
      }
    }
  }, [formData.fk_client_id, polices, formData.fk_police_id, formData.fk_vehicule_id]);

  // Suggérer une police basée sur le véhicule sélectionné
  useEffect(() => {
    if (formData.fk_vehicule_id && formData.fk_vehicule_id > 0 && formData.fk_client_id) {
      const clientPolices = polices.filter(
        (police) => police.fk_client_id === formData.fk_client_id
      );

      const policeWithVehicule = clientPolices.find(police =>
        police.vehicules?.some(v => v.id === formData.fk_vehicule_id)
      );

      if (policeWithVehicule && (!formData.fk_police_id || formData.fk_police_id === 0)) {
        setFormData(prev => ({ ...prev, fk_police_id: policeWithVehicule.id }));
      }
    }
  }, [formData.fk_vehicule_id, polices, formData.fk_client_id, formData.fk_police_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.num_devis) {
      alert("Veuillez entrer un numéro de devis");
      return;
    }
    if (!formData.fk_client_id) {
      alert("Veuillez sélectionner un client");
      return;
    }
    if (!formData.fk_vehicule_id) {
      alert("Veuillez sélectionner un véhicule");
      return;
    }
    if (!formData.fk_police_id) {
      alert("Veuillez sélectionner une police");
      return;
    }

    try {
      // Préparer les données avec le bon format pour l'API
      const submitData = {
        ...formData,
        date_effet: new Date(formData.date_effet).toISOString().split('T')[0],
        date_echeance: new Date(formData.date_echeance).toISOString().split('T')[0],
        // Le statut vient directement du formulaire
        statut: formData.statut || 'en_attente'
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setFilteredVehicules([]);
    setFilteredPolices([]);
    onClose();
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString || dateString === "") return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  const handleDateEffetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date_effet: e.target.value });
  };

  const handleDateEcheanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date_echeance: e.target.value });
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = parseInt(e.target.value) || 0;
    setFormData({
      ...formData,
      fk_client_id: clientId,
      fk_vehicule_id: 0,
      fk_police_id: 0
    });
  };

  const handleVehiculeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, fk_vehicule_id: value ? parseInt(value) : 0 });
  };

  const handlePoliceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, fk_police_id: value ? parseInt(value) : 0 });
  };

  // Générer un numéro de devis automatique
  const generateNumDevis = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEV-${year}${month}${day}-${random}`;
  };

  const handleGenerateNumDevis = () => {
    setFormData({ ...formData, num_devis: generateNumDevis() });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-3xl"
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border border-green-200/50 dark:border-green-800/50 shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center">
              {isEditing ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Modifier le devis" : "Nouveau devis"}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEditing
              ? "Modifier les informations du devis"
              : "Remplissez les informations pour créer un nouveau devis"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Numéro de devis */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Numéro de devis *
                </Label>
                <button
                  type="button"
                  onClick={handleGenerateNumDevis}
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Générer automatiquement
                </button>
              </div>
              <Input
                value={formData.num_devis}
                onChange={(e) => setFormData({ ...formData, num_devis: e.target.value })}
                placeholder="DEV-20241215-001"
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>

            {/* Prime totale */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prime totale (MAD) *
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.prime_total === 0 ? "" : formData.prime_total}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    prime_total: value === "" ? 0 : parseFloat(value) || 0
                  });
                }}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>

            {/* Statut */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut *
              </Label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
              >
                <option value="en_attente">En attente</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
                <option value="expire">Expiré</option>
              </select>
            </div>

            {/* Date d'effet */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date d'effet *
              </Label>
              <Input
                type="date"
                value={formatDateForInput(formData.date_effet)}
                onChange={handleDateEffetChange}
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>

            {/* Date d'échéance */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date d'échéance *
              </Label>
              <Input
                type="date"
                value={formatDateForInput(formData.date_echeance)}
                onChange={handleDateEcheanceChange}
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>

            {/* Client */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client *
              </Label>
              <select
                value={formData.fk_client_id === 0 ? "" : formData.fk_client_id.toString()}
                onChange={handleClientChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
              >
                <option value="">Sélectionnez un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom_complet}
                  </option>
                ))}
              </select>
            </div>

            {/* Véhicule */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Véhicule *
              </Label>
              <select
                value={formData.fk_vehicule_id === 0 ? "" : formData.fk_vehicule_id.toString()}
                onChange={handleVehiculeChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
                disabled={!formData.fk_client_id || filteredVehicules.length === 0}
              >
                <option value="">
                  {!formData.fk_client_id
                    ? "Sélectionnez d'abord un client"
                    : filteredVehicules.length === 0
                      ? "Ce client n'a pas de véhicules"
                      : "Sélectionnez un véhicule"}
                </option>
                {filteredVehicules.map((vehicule) => (
                  <option key={vehicule.id} value={vehicule.id}>
                    <span style={{ fontWeight: 'bold' }}>{vehicule.marque}</span> {vehicule.model}
                  </option>
                ))}
              </select>
              {filteredVehicules.length > 0 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {filteredVehicules.length} véhicule(s) disponible(s) pour ce client
                </p>
              )}
              {!formData.fk_client_id && (
                <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  Veuillez d'abord sélectionner un client pour voir ses véhicules
                </p>
              )}
            </div>

            {/* Police d'assurance */}
            <div className="md:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Police d'assurance *
              </Label>

              <select
                value={formData.fk_police_id === 0 ? "" : formData.fk_police_id.toString()}
                onChange={handlePoliceChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
                disabled={!formData.fk_client_id || filteredPolices.length === 0}
              >
                <option value="">
                  {!formData.fk_client_id
                    ? "Sélectionnez d'abord un client"
                    : filteredPolices.length === 0
                      ? "Ce client n'a pas de polices"
                      : "Sélectionnez une police"}
                </option>
                {filteredPolices.map((police) => (
                  <option key={police.id} value={police.id}>
                    {police.num_police}
                  </option>
                ))}
              </select>

              {!formData.fk_client_id ? (
                <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  Veuillez d'abord sélectionner un client pour voir ses polices
                </p>
              ) : (
                <div className="mt-1 flex flex-col gap-0.5">
                  {filteredPolices.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {filteredPolices.length} police(s) disponible(s) pour ce client
                    </p>
                  )}
                  {formData.fk_police_id === 0 && filteredPolices.length > 0 && (
                    <p className="text-xs text-blue-500 dark:text-blue-400">
                      Veuillez choisir une police dans la liste ci-dessus
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2.5"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {loading ? "Chargement..." : (isEditing ? "Enregistrer" : "Créer le devis")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
