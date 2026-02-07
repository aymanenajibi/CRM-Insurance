import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Vehicule, VehiculeCreate } from "../../types/vehicule";
import { Client } from "../../types/client";
import { Select } from "antd";

interface VehiculeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Vehicule | null;
  clients: Client[];
  isEditing?: boolean;
  loading?: boolean;
}

const defaultFormData: VehiculeCreate = {
  matricule: "",
  marque: "",
  model: "",
  date_mise_en_circulation: "",
  valeur_venale: 0,
  puissance_fiscale: 0,
  fk_client_id: 0,
};

export function VehiculeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  clients,
  isEditing = false,
  loading = false,
}: VehiculeFormModalProps) {
  const [formData, setFormData] = useState<VehiculeCreate>(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date_mise_en_circulation: initialData.date_mise_en_circulation
          ? initialData.date_mise_en_circulation.split("T")[0]
          : "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.matricule) {
      alert("Veuillez entrer le matricule");
      return;
    }
    if (!formData.marque) {
      alert("Veuillez entrer la marque");
      return;
    }
    if (!formData.model) {
      alert("Veuillez entrer le modèle");
      return;
    }
    if (!formData.date_mise_en_circulation) {
      alert("Veuillez sélectionner la date de mise en circulation");
      return;
    }
    if (!formData.fk_client_id || formData.fk_client_id === 0) {
      alert("Veuillez sélectionner un propriétaire");
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString || dateString === "") return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  const generateMatricule = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = () => numbers[Math.floor(Math.random() * numbers.length)];

    const part1 = `${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`;
    const part2 = randomLetter();
    const part3 = `${randomNumber()}${randomNumber()}`;

    return `${part1}-${part2}-${part3}`;
  };

  const handleGenerateMatricule = () => {
    setFormData({ ...formData, matricule: generateMatricule() });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const showSummary = formData.matricule && formData.marque && formData.model && formData.fk_client_id;

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
              {isEditing ? "Modifier le véhicule" : "Nouveau véhicule"}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {isEditing ? "Mise à jour des informations" : "Création d'un véhicule"}
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

                {/* Section Informations générales */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Informations générales
                  </h4>

                  {/* Matricule */}
                  <div>
                    <Label htmlFor="matricule" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Matricule *
                    </Label>
                    <div className="flex gap-1.5">
                      <Input
                        id="matricule"
                        value={formData.matricule}
                        onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                        placeholder="12345-A-15"
                        required
                        className="flex-1 text-sm px-3 py-1.5 h-10"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateMatricule}
                        className="px-2.5 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded border border-gray-300 dark:border-gray-700 transition-colors whitespace-nowrap"
                      >
                        Générer
                      </button>
                    </div>
                  </div>

                  {/* Marque et Modèle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="marque" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Marque *
                      </Label>
                      <Input
                        id="marque"
                        value={formData.marque}
                        onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                        placeholder="Toyota"
                        required
                        className="w-full px-3 py-1.5 h-10 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="model" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Modèle *
                      </Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="Yaris"
                        required
                        className="w-full px-3 py-1.5 h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Date de mise en circulation */}
                  <div>
                    <Label htmlFor="date_mise_en_circulation" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date de mise en circulation *
                    </Label>
                    <Input
                      id="date_mise_en_circulation"
                      type="date"
                      value={formatDateForInput(formData.date_mise_en_circulation)}
                      onChange={(e) => setFormData({ ...formData, date_mise_en_circulation: e.target.value })}
                      required
                      className="w-full px-3 py-1.5 h-10 text-sm"
                    />
                  </div>
                </div>

                {/* Section Caractéristiques techniques */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Caractéristiques techniques
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Valeur vénale */}
                    <div>
                      <Label htmlFor="valeur_venale" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Valeur vénale
                      </Label>
                      <div className="relative">
                        <Input
                          id="valeur_venale"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.valeur_venale === 0 ? "" : formData.valeur_venale}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                              ...formData,
                              valeur_venale: value === "" ? 0 : parseFloat(value) || 0
                            });
                          }}
                          placeholder="0.00"
                          className="w-full pl-9 pr-3 py-1.5 h-10 text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                          <span className="text-xs text-gray-500 dark:text-gray-400">MAD</span>
                        </div>
                      </div>
                    </div>

                    {/* Puissance fiscale */}
                    <div>
                      <Label htmlFor="puissance_fiscale" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Puissance fiscale
                      </Label>
                      <div className="relative">
                        <Input
                          id="puissance_fiscale"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.puissance_fiscale === 0 ? "" : formData.puissance_fiscale}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                              ...formData,
                              puissance_fiscale: value === "" ? 0 : parseFloat(value) || 0
                            });
                          }}
                          placeholder="8"
                          className="w-full px-3 py-1.5 h-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Propriétaire avec Select d'Ant Design */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Propriétaire
                  </h4>

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
                      onChange={(value) => setFormData({ ...formData, fk_client_id: value })}
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
                    {clients.length > 0 && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {clients.length} client(s) disponible(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne Récapitulatif (1/3) */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded border border-gray-200 dark:border-gray-700 p-3 h-full">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                    Récapitulatif
                  </h4>

                  <div className="space-y-3">
                    {/* Informations du véhicule */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Véhicule</p>
                      </div>
                      <div className="pl-3">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {formData.matricule || "—"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formData.marque || "Marque"} {formData.model || "Modèle"}
                        </p>
                      </div>
                    </div>

                    {/* Informations techniques */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Caractéristiques</p>
                      </div>
                      <div className="pl-3 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Puissance:</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {formData.puissance_fiscale || 0} CV
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Valeur:</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(formData.valeur_venale)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informations du propriétaire */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Propriétaire</p>
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

                    {/* Âge du véhicule et Mise en circulation */}
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      {formData.date_mise_en_circulation && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mise en circulation</p>
                          <p className="text-xs text-gray-900 dark:text-white">
                            {new Date(formData.date_mise_en_circulation).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          {(() => {
                            const miseEnCirculation = new Date(formData.date_mise_en_circulation);
                            const maintenant = new Date();
                            const ageEnAnnees = maintenant.getFullYear() - miseEnCirculation.getFullYear();
                            const ageEnMois = (maintenant.getFullYear() - miseEnCirculation.getFullYear()) * 12
                              + (maintenant.getMonth() - miseEnCirculation.getMonth());

                            let statusColor = "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
                            let statusText = "";

                            if (ageEnAnnees < 5) {
                              statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
                              statusText = "Récent";
                            } else if (ageEnAnnees < 10) {
                              statusColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
                              statusText = "Moyen";
                            } else {
                              statusColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
                              statusText = "Ancien";
                            }

                            return (
                              <div className="mt-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">Âge:</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                    {statusText} • {ageEnAnnees} an{ageEnAnnees > 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">Valeur estimée</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatCurrency(formData.valeur_venale)}
                        </p>
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
                  disabled={loading || !formData.matricule || !formData.marque || !formData.model || !formData.date_mise_en_circulation || !formData.fk_client_id}
                  className="px-3 py-1.5 text-xs h-8 min-w-[110px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
