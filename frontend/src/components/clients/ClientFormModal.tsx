// ClientFormModal.tsx
import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { ClientFormData } from "../../types/client";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  initialData?: ClientFormData;
  isEditing?: boolean;
  loading?: boolean;
}

const defaultFormData: ClientFormData = {
  nom_complet: "",
  cin: "",
  date_naissance: "",
  ville: "",
  type_permis: "",
};

export function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  loading = false,
}: ClientFormModalProps) {
  const [formData, setFormData] = useState<ClientFormData>(defaultFormData);

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
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const isFormValid =
    formData.nom_complet &&
    formData.cin &&
    formData.date_naissance &&
    formData.ville &&
    formData.type_permis;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-xl w-full overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {isEditing ? "Modifier le client" : "Nouveau client"}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
              {isEditing
                ? "Modifier les informations du client"
                : "Créer un nouveau client"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nom complet */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom complet *
              </Label>
              <Input
                value={formData.nom_complet}
                onChange={(e) =>
                  setFormData({ ...formData, nom_complet: e.target.value })
                }
                placeholder="John Doe"
                required
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
              />
            </div>

            {/* CIN */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CIN (Carte d'Identité Nationale) *
              </Label>
              <Input
                value={formData.cin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cin: e.target.value.toUpperCase(),
                  })
                }
                placeholder="AB123456"
                required
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
              />
            </div>

            {/* Date de naissance */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de naissance *
              </Label>
              <Input
                type="date"
                value={formatDateForInput(formData.date_naissance)}
                onChange={(e) =>
                  setFormData({ ...formData, date_naissance: e.target.value })
                }
                required
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
              />
            </div>

            {/* Ville */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ville *
              </Label>
              <Input
                value={formData.ville}
                onChange={(e) =>
                  setFormData({ ...formData, ville: e.target.value })
                }
                placeholder="Casablanca"
                required
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
              />
            </div>

            {/* Type de permis */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de permis *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {["A", "B", "C", "D"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type_permis: type })
                    }
                    className={`px-3 py-2 text-sm rounded border transition-all ${
                      formData.type_permis === type
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-400 font-medium"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Permis {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Message de validation */}
            {!isFormValid ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800 p-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 truncate">
                    Tous les champs sont obligatoires
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 p-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-green-700 dark:text-green-300 truncate">
                    Formulaire complet
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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
                className="px-3 py-1.5 text-xs h-8 min-w-[100px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="animate-spin h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    En cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
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
