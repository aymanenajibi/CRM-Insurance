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
  const [availableDevis, setAvailableDevis] = useState<Devis[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    // Filtrer les devis : ne montrer que ceux qui n'ont PAS de quittance
    const devisWithoutQuittance = devis.filter(devisItem => !devisItem.quittance);
    setAvailableDevis(devisWithoutQuittance);

    // Si on est en mode édition, garder le devis actuel même s'il a une quittance
    if (isEditing && initialData?.fk_devis_id) {
      const currentDevis = devis.find(d => d.id === initialData.fk_devis_id);
      if (currentDevis && !devisWithoutQuittance.some(d => d.id === currentDevis.id)) {
        setAvailableDevis([currentDevis, ...devisWithoutQuittance]);
      }
    }
  }, [devis, isEditing, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // EMPÊCHER la création manuelle si ce n'est pas une édition
    if (!isEditing) {
      alert("Les quittances sont créées automatiquement avec les devis.\n\nCréez d'abord un devis pour générer une quittance.");
      onClose();
      return;
    }

    // Seulement autoriser l'édition
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full overflow-hidden border border-gray-200 dark:border-gray-700">

        {/* Header sobre et professionnel */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? "Modifier la quittance" : "Nouvelle quittance"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {isEditing
                  ? "Modifier les informations de la quittance"
                  : "Créer une nouvelle quittance pour un devis"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu principal - PAS de hauteur maximale fixe */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Sélection du devis - SEULEMENT LE FORMAT EST MODIFIÉ */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Devis associé *
                </Label>
                <select
                  value={formData.fk_devis_id || ""}
                  onChange={(e) => handleDevisChange(parseInt(e.target.value))}
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 transition-all appearance-none text-gray-900 dark:text-white"
                  required
                  disabled={!isEditing && availableDevis.length === 0}
                >
                  <option value="" className="text-gray-400 dark:text-gray-500">
                    {!isEditing && availableDevis.length === 0
                      ? "Aucun devis disponible (tous ont déjà une quittance)"
                      : "Sélectionnez un devis"}
                  </option>
                  {availableDevis.map((devisItem) => (
                    <option key={devisItem.id} value={devisItem.id} className="text-gray-900 dark:text-white">
                      {devisItem.num_devis || `DEV-${devisItem.id}`} • {formatCurrency(devisItem.prime_total)}
                    </option>
                  ))}
                </select>

                {/* Message d'information */}
                {!isEditing && (
                  <div className="mt-2">
                    {availableDevis.length === 0 ? (
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Tous les devis ont déjà une quittance. Créez un nouveau devis.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {availableDevis.length} devis disponible(s) sans quittance
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Informations financières */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                  Informations financières
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="block text-sm text-gray-600 dark:text-gray-400">Prime totale</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formatCurrency(formData.prime_total)}
                        readOnly
                        className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="block text-sm text-gray-600 dark:text-gray-400">Montant encaissé *</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={formData.prime_total}
                        value={formData.montant_encaisse || ""}
                        onChange={(e) => handleMontantEncaisseChange(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        required
                        className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 transition-all"
                      />
                      <span className="absolute right-4 top-3 text-sm text-gray-500 dark:text-gray-400">MAD</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="block text-sm text-gray-600 dark:text-gray-400">Solde</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formatCurrency(formData.solde)}
                        readOnly
                        className={`w-full px-4 py-3 text-sm border rounded-md ${formData.solde > 0
                          ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Mode de paiement *
                </Label>
                <select
                  value={formData.mode_paiement}
                  onChange={(e) => setFormData({ ...formData, mode_paiement: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 transition-all appearance-none text-gray-900 dark:text-white"
                  required
                >
                  <option value="" className="text-gray-400 dark:text-gray-500">Sélectionnez un mode de paiement</option>
                  <option value="espèces" className="text-gray-900 dark:text-white">Espèces</option>
                  <option value="carte bancaire" className="text-gray-900 dark:text-white">Carte bancaire</option>
                  <option value="chèque" className="text-gray-900 dark:text-white">Chèque</option>
                  <option value="virement" className="text-gray-900 dark:text-white">Virement bancaire</option>
                  <option value="prélèvement" className="text-gray-900 dark:text-white">Prélèvement automatique</option>
                </select>
              </div>

              {/* Récapitulatif du devis */}
              {formData.fk_devis_id > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">Informations du devis</h5>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Devis</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {devis.find(d => d.id === formData.fk_devis_id)?.num_devis || `DEV-${formData.fk_devis_id}`}
                      </span>
                    </div>

                    {devis.find(d => d.id === formData.fk_devis_id)?.client && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Client</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {devis.find(d => d.id === formData.fk_devis_id)?.client?.nom_complet}
                        </span>
                      </div>
                    )}

                    {devis.find(d => d.id === formData.fk_devis_id)?.vehicule && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Véhicule</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {devis.find(d => d.id === formData.fk_devis_id)?.vehicule?.matricule}
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total à payer</span>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(formData.prime_total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Avertissement si montant > prime totale */}
              {formData.montant_encaisse > formData.prime_total && (
                <div className="bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800 p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Le montant encaissé ne peut pas dépasser la prime totale
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer avec Actions - PAS sticky */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || formData.montant_encaisse > formData.prime_total || (!isEditing && availableDevis.length === 0)}
                  className="px-5 py-2.5 text-sm font-medium bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </span>
                  ) : (
                    isEditing ? "Enregistrer" : "Créer"
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
