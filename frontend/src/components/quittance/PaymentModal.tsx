import { useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Quittance, PaymentData } from "../../types/quittance";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: PaymentData) => Promise<void>;
  quittance: Quittance | null;
  loading?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  quittance,
  loading = false,
}: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    montant_encaisse: 0,
    mode_paiement: ""
  });

  if (!quittance) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onConfirm(paymentData);
      onClose();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleClose = () => {
    setPaymentData({
      montant_encaisse: 0,
      mode_paiement: ""
    });
    onClose();
  };

  const maxAmount = quittance.solde;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const paymentMethods = [
    { value: "espèces", label: "Espèces" },
    { value: "carte bancaire", label: "Carte bancaire" },
    { value: "chèque", label: "Chèque" },
    { value: "virement", label: "Virement bancaire" },
    { value: "prélèvement", label: "Prélèvement automatique" },
  ];

  const calculatePaymentPercentage = () => {
    return Math.round(((quittance.prime_total - quittance.solde) / quittance.prime_total) * 100);
  };

  const isFormValid = paymentData.montant_encaisse > 0 &&
    paymentData.montant_encaisse <= maxAmount &&
    paymentData.mode_paiement !== "";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full border border-gray-200 dark:border-gray-700">

        {/* Header sobre et professionnel */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Enregistrement de paiement
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Quittance #{quittance.id} • {quittance.client?.nom_complet || "Client"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-5">
          {/* Section Informations du paiement */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Situation de paiement
            </h4>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Prime totale</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(quittance.prime_total)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Déjà encaissé</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(quittance.montant_encaisse || 0)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Solde restant</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(maxAmount)}
                  </div>
                </div>
              </div>

              {/* Barre de progression - simple et sobre */}
              {quittance.solde > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progression</span>
                    <span>{calculatePaymentPercentage()}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-800 dark:bg-gray-400 rounded-full transition-all duration-300"
                      style={{ width: `${calculatePaymentPercentage()}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Montant à encaisser */}
              <div>
                <Label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Montant à encaisser *
                </Label>

                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={maxAmount}
                    value={paymentData.montant_encaisse || ""}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      montant_encaisse: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0"
                    required
                    className="w-full pl-3 pr-12 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-500 dark:text-gray-400">MAD</span>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum: {formatCurrency(maxAmount)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPaymentData({
                        ...paymentData,
                        montant_encaisse: maxAmount / 2
                      })}
                      className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentData({
                        ...paymentData,
                        montant_encaisse: maxAmount
                      })}
                      className="text-xs px-2 py-1 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 rounded transition-colors font-medium"
                    >
                      Total
                    </button>
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div>
                <Label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Mode de paiement *
                </Label>

                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => {
                    const isSelected = paymentData.mode_paiement === method.value;

                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPaymentData({
                          ...paymentData,
                          mode_paiement: method.value
                        })}
                        className={`p-3 rounded-md border transition-all duration-150 text-left ${isSelected
                            ? 'border-gray-800 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gray-800 dark:bg-gray-400' : 'bg-gray-300 dark:bg-gray-600'
                              }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {method.label}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0 ml-1">
                              <svg className="w-3.5 h-3.5 text-gray-800 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message d'information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Le solde sera automatiquement mis à jour après confirmation.</span>
                  </div>
                </div>
              </div>

              {/* Avertissement si montant > solde */}
              {paymentData.montant_encaisse > maxAmount && (
                <div className="bg-red-50 dark:bg-red-900/30 rounded-md border border-red-200 dark:border-red-800 p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Le montant ne peut pas dépasser le solde restant
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer avec Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-6">
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                  ) : (
                    "Confirmer le paiement"
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
