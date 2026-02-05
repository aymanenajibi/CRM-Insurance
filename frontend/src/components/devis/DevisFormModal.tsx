import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { DevisFormData } from "../../types/devis";
import { Client } from "../../types/client";
import { Vehicule } from "../../types/vehicule";
import { Police } from "../../types/police";
import { Select } from "antd";

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

      if (clientVehicules.length > 0 && (!formData.fk_vehicule_id || formData.fk_vehicule_id === 0)) {
        setFormData(prev => ({ ...prev, fk_vehicule_id: clientVehicules[0].id }));
      }

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

  // Filtrer et auto-sélectionner les polices
  useEffect(() => {
    if (formData.fk_client_id && formData.fk_client_id > 0) {
      const clientPolices = polices.filter(
        (police) => police.fk_client_id === formData.fk_client_id
      );
      setFilteredPolices(clientPolices);

      if (clientPolices.length === 1 && !formData.fk_police_id) {
        setFormData(prev => ({ ...prev, fk_police_id: clientPolices[0].id }));
      }

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

  // Suggérer une police basée sur le véhicule
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
      const submitData = {
        ...formData,
        date_effet: new Date(formData.date_effet).toISOString().split('T')[0],
        date_echeance: new Date(formData.date_echeance).toISOString().split('T')[0],
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

  const handleClientChange = (value: number) => {
    setFormData({
      ...formData,
      fk_client_id: value,
      fk_vehicule_id: 0,
      fk_police_id: 0
    });
  };

  const handleVehiculeChange = (value: number) => {
    setFormData({ ...formData, fk_vehicule_id: value });
  };

  const handlePoliceChange = (value: number) => {
    setFormData({ ...formData, fk_police_id: value });
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const statusOptions = [
    { value: "en_attente", label: "En attente" },
    { value: "accepte", label: "Accepté" },
    { value: "refuse", label: "Refusé" },
    { value: "expire", label: "Expiré" },
  ];

  const showSummary = formData.fk_client_id && formData.fk_vehicule_id && formData.fk_police_id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
    >
      {/* Header compact */}
      <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Modifier le devis" : "Nouveau devis"}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {isEditing ? "Mise à jour des informations" : "Création d'un devis"}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full p-5">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            {/* Grille principale */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 mb-4">

              {/* Colonne Formulaire (2/3) */}
              <div className="lg:col-span-2 space-y-4">

                {/* Section Informations du devis */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Informations du devis
                  </h4>

                  {/* Numéro de devis */}
                  <div>
                    <Label htmlFor="num_devis" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Numéro de devis
                    </Label>
                    <div className="flex gap-1.5">
                      <Input
                        id="num_devis"
                        value={formData.num_devis}
                        onChange={(e) => setFormData({ ...formData, num_devis: e.target.value })}
                        placeholder="DEV-20241215-001"
                        required
                        className="flex-1 text-sm px-3 py-1.5 h-10"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateNumDevis}
                        className="px-2.5 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded border border-gray-300 dark:border-gray-700 transition-colors whitespace-nowrap"
                      >
                        Générer
                      </button>
                    </div>
                  </div>

                  {/* Prime totale et Statut */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="prime_total" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prime totale
                      </Label>
                      <div className="relative">
                        <Input
                          id="prime_total"
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
                          className="w-full pl-9 pr-3 py-1.5 h-10 text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                          <span className="text-xs text-gray-500 dark:text-gray-400">MAD</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="statut" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Statut
                      </Label>
                      <select
                        id="statut"
                        value={formData.statut}
                        onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                        className="w-full text-sm px-3 py-1.5 h-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
                        required
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="date_effet" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date d'effet
                      </Label>
                      <Input
                        id="date_effet"
                        type="date"
                        value={formatDateForInput(formData.date_effet)}
                        onChange={(e) => setFormData({ ...formData, date_effet: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 h-10 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="date_echeance" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date d'échéance
                      </Label>
                      <Input
                        id="date_echeance"
                        type="date"
                        value={formatDateForInput(formData.date_echeance)}
                        onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 h-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Relations avec Select d'Ant Design */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Relations
                  </h4>

                  <div className="space-y-3">
                    {/* Client */}
                    <div>
                      <Label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Client *
                      </Label>
                      <Select
                        showSearch
                        placeholder="Tapez pour rechercher un client..."
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        className="w-full custom-antd-select"
                        value={formData.fk_client_id || undefined}
                        onChange={handleClientChange}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        options={(clients || []).map((client) => ({
                          value: client.id,
                          label: `${client.nom_complet} (${client.cin})`,
                        }))}
                        style={{
                          height: "38px",
                          width: "100%",
                        }}
                      />
                    </div>

                    {/* Véhicule */}
                    <div>
                      <Label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Véhicule *
                      </Label>
                      <Select
                        showSearch
                        placeholder={!formData.fk_client_id
                          ? "Sélectionnez d'abord un client"
                          : filteredVehicules.length === 0
                            ? "Aucun véhicule disponible"
                            : "Tapez pour rechercher un véhicule..."
                        }
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        className="w-full custom-antd-select"
                        value={formData.fk_vehicule_id || undefined}
                        onChange={handleVehiculeChange}
                        disabled={!formData.fk_client_id || filteredVehicules.length === 0}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        options={(filteredVehicules || []).map((vehicule) => ({
                          value: vehicule.id,
                          label: `${vehicule.matricule} - ${vehicule.marque} ${vehicule.model}`,
                        }))}
                        style={{
                          height: "38px",
                          width: "100%",
                        }}
                      />
                      {filteredVehicules.length > 0 && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {filteredVehicules.length} véhicule(s) disponible(s)
                        </p>
                      )}
                    </div>

                    {/* Police d'assurance */}
                    <div>
                      <Label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Police d'assurance *
                      </Label>
                      <Select
                        showSearch
                        placeholder={!formData.fk_client_id
                          ? "Sélectionnez d'abord un client"
                          : filteredPolices.length === 0
                            ? "Aucune police disponible"
                            : "Tapez pour rechercher une police..."
                        }
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        className="w-full custom-antd-select"
                        value={formData.fk_police_id || undefined}
                        onChange={handlePoliceChange}
                        disabled={!formData.fk_client_id || filteredPolices.length === 0}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        options={(filteredPolices || []).map((police) => ({
                          value: police.id,
                          label: `${police.num_police} • ${formatCurrency(police.prime_totale || 0)}`,
                        }))}
                        style={{
                          height: "38px",
                          width: "100%",
                        }}
                      />
                      {filteredPolices.length > 0 && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {filteredPolices.length} police(s) disponible(s)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne Récapitulatif (1/3) */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded border border-gray-200 dark:border-gray-700 p-3 h-full">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Récapitulatif
                  </h4>

                  <div className="space-y-3">
                    {/* Informations du client */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Client</p>
                      </div>
                      <div className="pl-3">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {clients.find(c => c.id === formData.fk_client_id)?.nom_complet || "—"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {clients.find(c => c.id === formData.fk_client_id)?.cin || "CIN non renseignée"}
                        </p>
                      </div>
                    </div>

                    {/* Informations du véhicule */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Véhicule</p>
                      </div>
                      <div className="pl-3">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {vehicules.find(v => v.id === formData.fk_vehicule_id)?.matricule || "—"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {vehicules.find(v => v.id === formData.fk_vehicule_id)
                            ? `${vehicules.find(v => v.id === formData.fk_vehicule_id)?.marque} ${vehicules.find(v => v.id === formData.fk_vehicule_id)?.model}`
                            : "Marque/Modèle"}
                        </p>
                      </div>
                    </div>

                    {/* Informations de la police */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Police</p>
                      </div>
                      <div className="pl-3">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {polices.find(p => p.id === formData.fk_police_id)?.num_police || "—"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {polices.find(p => p.id === formData.fk_police_id)
                            ? formatCurrency(polices.find(p => p.id === formData.fk_police_id)?.prime_totale || 0)
                            : "Montant non défini"}
                        </p>
                      </div>
                    </div>

                    {/* Période et Montant total */}
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Période</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-900 dark:text-white">
                            {formData.date_effet
                              ? new Date(formData.date_effet).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                              : "—"}
                          </span>
                          <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <span className="text-xs text-gray-900 dark:text-white">
                            {formData.date_echeance
                              ? new Date(formData.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                              : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">Prime totale</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatCurrency(formData.prime_total)}
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${formData.statut === 'accepte'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : formData.statut === 'refuse'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : formData.statut === 'expire'
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                          {statusOptions.find(s => s.value === formData.statut)?.label || formData.statut}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {showSummary
                        ? "Toutes les informations sont complètes"
                        : "Complétez le formulaire pour voir le récapitulatif"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Toujours visible */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs h-8 min-w-[90px]"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.num_devis || !formData.fk_client_id || !formData.fk_vehicule_id || !formData.fk_police_id}
                  className="px-3 py-1.5 text-xs h-8 min-w-[110px] bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enregistrement...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isEditing ? "Enregistrer" : "Créer"}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
