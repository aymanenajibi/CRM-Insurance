import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { QuittanceFormData } from "../../types/quittance";
import { Client } from "../../types/client";
import { Vehicule } from "../../types/vehicule";
import { Devis } from "../../types/devis";

interface QuittanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuittanceFormData) => Promise<void>;
  initialData?: QuittanceFormData;
  devis: Devis[];
  clients: Client[];
  vehicules: Vehicule[];
  isEditing?: boolean;
  loading?: boolean;
}

const defaultFormData: QuittanceFormData = {
  fk_devis_id: 0,
  fk_vehicule_id: 0,
  fk_client_id: 0,
  prime_total: 0,
  montant_encaisse: 0,
  solde: 0,
  mode_paiement: "",
};

export function QuittanceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  devis,
  clients,
  vehicules,
  isEditing = false,
  loading = false,
}: QuittanceFormModalProps) {
  const [formData, setFormData] = useState<QuittanceFormData>(defaultFormData);

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

  const handleDevisChange = (devisId: number) => {
    const selectedDevis = devis.find(d => d.id === devisId);
    if (selectedDevis) {
      setFormData({
        ...formData,
        fk_devis_id: devisId,
        fk_client_id: selectedDevis.fk_client_id,
        fk_vehicule_id: selectedDevis.fk_vehicule_id,
        prime_total: selectedDevis.prime_total,
        solde: selectedDevis.prime_total - formData.montant_encaisse
      });
    }
  };

  const handleMontantEncaisseChange = (montant: number) => {
    const solde = formData.prime_total - montant;
    setFormData({
      ...formData,
      montant_encaisse: montant,
      solde: solde < 0 ? 0 : solde
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-2xl"
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl p-8">
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
            {isEditing ? "Modifier la quittance" : "Nouvelle quittance"}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEditing
              ? "Modifier les informations de la quittance"
              : "Créez une nouvelle quittance pour un devis"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Devis associé *
              </Label>
              <select
                value={formData.fk_devis_id || ""}
                onChange={(e) => handleDevisChange(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
              >
                <option value="">Sélectionnez un devis</option>
                {devis.map((devisItem) => (
                  <option key={devisItem.id} value={devisItem.id}>
                    Devis #{devisItem.id} - {devisItem.client?.nom_complet} - {devisItem.prime_total} MAD
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prime totale (MAD)
                </Label>
                <Input
                  type="number"
                  value={formData.prime_total}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Montant encaissé (MAD) *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.prime_total}
                  value={formData.montant_encaisse}
                  onChange={(e) => handleMontantEncaisseChange(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Solde (MAD)
                </Label>
                <Input
                  type="number"
                  value={formData.solde}
                  readOnly
                  className={`w-full px-4 py-3 ${formData.solde > 0 ? 'bg-amber-50/50 dark:bg-amber-900/20' : 'bg-gray-50/50 dark:bg-gray-800/50'} border border-gray-300/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white`}
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode de paiement *
              </Label>
              <select
                value={formData.mode_paiement}
                onChange={(e) => setFormData({ ...formData, mode_paiement: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none text-gray-900 dark:text-white"
                required
              >
                <option value="">Sélectionnez un mode de paiement</option>
                <option value="espèces">Espèces</option>
                <option value="carte bancaire">Carte bancaire</option>
                <option value="chèque">Chèque</option>
                <option value="virement">Virement bancaire</option>
                <option value="prélèvement">Prélèvement automatique</option>
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Informations du devis
                </p>
                {formData.fk_devis_id && (
                  <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {devis.find(d => d.id === formData.fk_devis_id)?.client && (
                      <p>Client: {devis.find(d => d.id === formData.fk_devis_id)?.client?.nom_complet}</p>
                    )}
                    {devis.find(d => d.id === formData.fk_devis_id)?.vehicule && (
                      <p>Véhicule: {devis.find(d => d.id === formData.fk_devis_id)?.vehicule?.matricule}</p>
                    )}
                  </div>
                )}
              </div>
              {formData.prime_total > 0 && (
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formData.prime_total} MAD
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total à payer
                  </p>
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
              {loading ? "Chargement..." : (isEditing ? "Enregistrer" : "Créer")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
