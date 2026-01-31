// components/clients/ClientFormModal.tsx
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
    setFormData({ ...formData, date_naissance: e.target.value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-2"
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-600 dark:from-blue-600 dark:to-teal-700 flex items-center justify-center">
              {isEditing ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Modifier le client" : "Nouveau client"}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEditing 
              ? "Modifier les informations du client" 
              : "Remplissez les informations pour créer un nouveau client"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom complet *
              </Label>
              <Input
                value={formData.nom_complet}
                onChange={(e) => setFormData({...formData, nom_complet: e.target.value})}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CIN *
              </Label>
              <Input
                value={formData.cin}
                onChange={(e) => setFormData({...formData, cin: e.target.value})}
                placeholder="AB123456"
                required
                title="Format: 2 lettres suivies de 6 chiffres (ex: AB123456)"
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de naissance *
              </Label>
              <Input
                type="date"
                value={formatDateForInput(formData.date_naissance)}
                onChange={handleDateChange}
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ville *
              </Label>
              <Input
                value={formData.ville}
                onChange={(e) => setFormData({...formData, ville: e.target.value})}
                placeholder="Casablanca"
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de permis *
              </Label>
              <select
                value={formData.type_permis}
                onChange={(e) => setFormData({...formData, type_permis: e.target.value})}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="A">A - Moto</option>
                <option value="B">B - Voiture</option>
                <option value="C">C - Poids lourd</option>
                <option value="D">D - Transport en commun</option>
                <option value="E">E - Véhicule attelé</option>
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
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              {loading ? "Chargement..." : (isEditing ? "Enregistrer" : "Créer")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}