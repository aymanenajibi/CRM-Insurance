import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { PoliceFormData } from "../../types/police";
import { Client } from "../../types/client";

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

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date_souscription: e.target.value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-2xl"
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 flex items-center justify-center">
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
            {isEditing ? "Modifier la police" : "Nouvelle police"}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEditing
              ? "Modifier les informations de la police"
              : "Remplissez les informations pour créer une nouvelle police"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de police *
              </Label>
              <Input
                value={formData.num_police}
                onChange={(e) => setFormData({ ...formData, num_police: e.target.value })}
                placeholder="POL-2024-001"
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de souscription *
              </Label>
              <Input
                type="date"
                value={formatDateForInput(formData.date_souscription)}
                onChange={handleDateChange}
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client associé *
              </Label>
              <select
                value={formData.fk_client_id || ""}
                onChange={(e) => setFormData({ ...formData, fk_client_id: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
              >
                <option value="">Sélectionnez un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom_complet} (CIN: {client.cin})
                  </option>
                ))}
              </select>
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
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? "Chargement..." : (isEditing ? "Enregistrer" : "Créer")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
