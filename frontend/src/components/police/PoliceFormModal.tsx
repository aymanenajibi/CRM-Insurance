import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { PoliceFormData } from "../../types/police";
import { Client } from "../../types/client";
import { Select } from "antd";

interface PoliceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PoliceFormData) => Promise<void>;
  initialData?: PoliceFormData;
  clients: Client[];
  isEditing?: boolean;
  loading?: boolean;
}

const defaultFormData: PoliceFormData = {
  num_police: "",
  date_souscription: "",
  fk_client_id: 0,
};

export function PoliceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  clients,
  isEditing = false,
  loading = false,
}: PoliceFormModalProps) {
  const [formData, setFormData] = useState<PoliceFormData>(defaultFormData);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showRecap, setShowRecap] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.fk_client_id) {
        const client = clients.find(c => c.id === initialData.fk_client_id);
        setSelectedClient(client || null);
        setShowRecap(true);
      } else {
        setShowRecap(false);
      }
    } else {
      setFormData(defaultFormData);
      setSelectedClient(null);
      setShowRecap(false);
    }
  }, [initialData, isOpen, clients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setSelectedClient(null);
    setShowRecap(false);
    onClose();
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  const generateNumPolice = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `POL-${year}${month}${day}-${random}`;
  };

  const handleGenerateNumPolice = () => {
    setFormData({ ...formData, num_police: generateNumPolice() });
  };

  const handleClientChange = (value: number) => {
    setFormData({ ...formData, fk_client_id: value });
    const client = clients.find(c => c.id === value);
    setSelectedClient(client || null);
    setShowRecap(value > 0);
  };

  const isFormValid = formData.num_police && formData.date_souscription && formData.fk_client_id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-xl w-full overflow-hidden"
    >
      {/* Header fixe */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {isEditing ? "Modifier la police" : "Nouvelle police"}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
              {isEditing
                ? "Modifier les informations de la police"
                : "Créer une nouvelle police d'assurance"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenu principal - Hauteur fixe sans scroll */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Numéro de police */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de police *
              </Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={formData.num_police}
                    onChange={(e) => setFormData({ ...formData, num_police: e.target.value })}
                    placeholder="POL-20241215-001"
                    required
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNumPolice}
                  className="flex-shrink-0 px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded border border-gray-300 dark:border-gray-700 transition-colors whitespace-nowrap"
                >
                  Générer
                </button>
              </div>
            </div>

            {/* Date de souscription */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de souscription *
              </Label>
              <Input
                type="date"
                value={formatDateForInput(formData.date_souscription)}
                onChange={(e) => setFormData({ ...formData, date_souscription: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
              />
            </div>

            {/* Client associé avec Select d'Ant Design */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client associé *
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

            {/* Récapitulatif - Conditionnel et compact */}
            {showRecap && (
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    Récapitulatif
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center min-h-[20px]">
                    <span className="text-gray-600 dark:text-gray-400 truncate">Police:</span>
                    <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                      {formData.num_police || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center min-h-[20px]">
                    <span className="text-gray-600 dark:text-gray-400 truncate">Client:</span>
                    <span className="font-medium text-gray-900 dark:text-white truncate ml-2 text-right">
                      {selectedClient?.nom_complet || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center min-h-[20px]">
                    <span className="text-gray-600 dark:text-gray-400 truncate">Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                      {formData.date_souscription
                        ? new Date(formData.date_souscription).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short'
                        })
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Message de validation - Compact */}
            {!isFormValid ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800 p-2">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 truncate">
                    Remplissez tous les champs obligatoires (*)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 p-2">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-green-700 dark:text-green-300 truncate">
                    Formulaire complet
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Toujours visible */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="px-3 py-1.5 text-xs h-8 min-w-[80px]"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="px-3 py-1.5 text-xs h-8 min-w-[100px] bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    En cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
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
    </Modal>
  );
}
