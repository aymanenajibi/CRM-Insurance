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
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border border-blue-200/50 dark:border-blue-800/50 shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enregistrer un paiement
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complétez le paiement de la quittance #{quittance.id}
          </p>
        </div>

        <div className="mb-6 p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Solde restant
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(maxAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total initial
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(quittance.prime_total)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Montant à encaisser (MAD) *
              </Label>
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
                placeholder="0.00"
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Maximum: {formatCurrency(maxAmount)}
                </span>
                <button
                  type="button"
                  onClick={() => setPaymentData({
                    ...paymentData,
                    montant_encaisse: maxAmount
                  })}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Règler le solde complet
                </button>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode de paiement *
              </Label>
              <select
                value={paymentData.mode_paiement}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  mode_paiement: e.target.value
                })}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-gray-900 dark:text-white"
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
              disabled={loading || paymentData.montant_encaisse === 0 || !paymentData.mode_paiement}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {loading ? "Enregistrement..." : "Enregistrer le paiement"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
