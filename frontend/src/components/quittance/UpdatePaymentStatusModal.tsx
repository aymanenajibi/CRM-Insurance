import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Quittance } from "../../types/quittance";

interface UpdatePaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    statut_paiement: string;
    montant_encaisse?: number;
    solde?: number;
  }) => Promise<void>;
  quittance: Quittance | null;
  loading?: boolean;
}

const PAYMENT_STATUSES = [
  { id: 1, label: "payé", description: "Totalement réglé" },
  { id: 2, label: "partiel", description: "Acompte reçu" },
  { id: 3, label: "impayé", description: "En attente de paiement" },
  { id: 4, label: "annulé", description: "Paiement annulé" },
  { id: 5, label: "en_attente", description: "En cours de traitement" },
  { id: 6, label: "remboursé", description: "Paiement remboursé" },
];

export function UpdatePaymentStatusModal({
  isOpen,
  onClose,
  onConfirm,
  quittance,
  loading = false,
}: UpdatePaymentStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);

  useEffect(() => {
    if (quittance) {
      setSelectedStatus(quittance.statut_paiement || "impayé");
    }
  }, [quittance]);

  if (!quittance) return null;

  const calculateNewAmounts = (newStatus: string) => {
    const primeTotal = quittance.prime_total || 0;
    const currentStatus = quittance.statut_paiement || "impayé";

    let newMontant = quittance.montant_encaisse || 0;
    let newSolde = quittance.solde || primeTotal;

    switch (newStatus) {
      case "payé":
        newMontant = primeTotal;
        newSolde = 0;
        break;
      case "impayé":
        newMontant = 0;
        newSolde = primeTotal;
        break;
      case "partiel":
        if (currentStatus !== "partiel") {
          newMontant = primeTotal * 0.5;
          newSolde = primeTotal * 0.5;
        }
        break;
      case "annulé":
      case "remboursé":
        newMontant = 0;
        newSolde = primeTotal;
        break;
      default:
        break;
    }

    const total = newMontant + newSolde;
    const tolerance = 0.01;

    if (Math.abs(total - primeTotal) > tolerance) {
      newSolde = primeTotal - newMontant;
      if (newSolde < 0) {
        newMontant = primeTotal;
        newSolde = 0;
      }
    }

    return { newMontant, newSolde };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    try {
      if (selectedStatus === (quittance.statut_paiement || "impayé")) {
        onClose();
        return;
      }

      const { newMontant, newSolde } = calculateNewAmounts(selectedStatus);
      const updateData = {
        statut_paiement: selectedStatus,
        montant_encaisse: newMontant,
        solde: newSolde
      };

      await onConfirm(updateData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setCalculating(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status: string | undefined): string => {
    if (!status) return "text-gray-700 dark:text-gray-300";
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "payé": return "text-green-700 dark:text-green-400";
      case "partiel": return "text-amber-700 dark:text-amber-400";
      case "impayé": return "text-gray-700 dark:text-gray-300";
      case "en_attente": return "text-blue-700 dark:text-blue-400";
      case "annulé": return "text-gray-600 dark:text-gray-400";
      case "remboursé": return "text-purple-700 dark:text-purple-400";
      default: return "text-gray-700 dark:text-gray-300";
    }
  };

  const getChangeDescription = () => {
    if (!selectedStatus || selectedStatus === (quittance.statut_paiement || "impayé")) {
      return null;
    }

    const { newMontant, newSolde } = calculateNewAmounts(selectedStatus);
    const currentMontant = quittance.montant_encaisse || 0;
    const currentSolde = quittance.solde || quittance.prime_total;

    const changes: string[] = [];

    if (Math.abs(newMontant - currentMontant) > 0.01) {
      changes.push(`Encaissé : ${formatCurrency(currentMontant)} → ${formatCurrency(newMontant)}`);
    }

    if (Math.abs(newSolde - currentSolde) > 0.01) {
      changes.push(`Solde : ${formatCurrency(currentSolde)} → ${formatCurrency(newSolde)}`);
    }

    return changes;
  };

  const changeDescription = getChangeDescription();
  const hasChanges = changeDescription && changeDescription.length > 0;
  const isStatusUnchanged = selectedStatus === (quittance.statut_paiement || "impayé");

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full border border-gray-200 dark:border-gray-700">

        {/* Header sobre et professionnel */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Mettre à jour le statut de paiement
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

        {/* Contenu principal - réduit */}
        <div className="p-5">
          {/* Section Informations Actuelles */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Situation actuelle
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Prime totale</span>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(quittance.prime_total)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Statut actuel</div>
                  <div className={`text-sm font-medium ${getStatusColor(quittance.statut_paiement)}`}>
                    {quittance.statut_paiement || "Non défini"}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Encaissé</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(quittance.montant_encaisse || 0)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Solde</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(quittance.solde || quittance.prime_total)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Sélection du Statut - COULEURS ANNULÉES */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Nouveau statut
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">Sélectionnez une option</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_STATUSES.map((status) => {
                const isSelected = selectedStatus === status.label;

                return (
                  <button
                    type="button"
                    key={status.id}
                    onClick={() => setSelectedStatus(status.label)}
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
                        {/* Texte du statut en gris seulement - pas de couleurs */}
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {status.label.charAt(0).toUpperCase() + status.label.slice(1)}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                          {status.description}
                        </p>
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

          {/* Aperçu des Changements */}
          {hasChanges && (
            <div className="mb-5">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <h5 className="text-xs font-medium text-gray-900 dark:text-white">
                    Modifications à appliquer
                  </h5>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {/* Ancien statut avec couleur */}
                    <div className={`text-xs font-medium ${getStatusColor(quittance.statut_paiement)}`}>
                      {quittance.statut_paiement || "Non défini"}
                    </div>
                    <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {/* Nouveau statut avec couleur */}
                    <div className={`text-xs font-medium ${getStatusColor(selectedStatus)}`}>
                      {selectedStatus}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {changeDescription.map((change, index) => {
                      const isEncaissé = change.includes('Encaissé');

                      return (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            {isEncaissé ? 'Encaissé' : 'Solde'}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${isEncaissé
                                ? 'text-green-700 dark:text-green-400'
                                : 'text-amber-700 dark:text-amber-400'
                              }`}>
                              {change.split('→')[0].trim()}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 text-xs">→</span>
                            <span className={`font-semibold ${isEncaissé
                                ? 'text-green-800 dark:text-green-300'
                                : 'text-amber-800 dark:text-amber-300'
                              }`}>
                              {change.split('→')[1].trim()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isStatusUnchanged && selectedStatus && (
            <div className="mb-5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Statut actuel déjà "<span className={`font-medium ${getStatusColor(selectedStatus)}`}>{selectedStatus}</span>"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer avec Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading || calculating}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || calculating || !selectedStatus || isStatusUnchanged}
              className="px-3 py-1.5 text-xs font-medium bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || calculating ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
