import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { QuittanceFormModal } from "./QuittanceFormModal";
import { DeleteModal } from "./DeleteModal";
import { PaymentModal } from "./PaymentModal";
import { useQuittanceStore } from "../../store/quittanceStore";
import { QuittanceFormData, Quittance, PaymentData } from "../../types/quittance";

// Icons
const AddIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function QuittanceTable() {
  const {
    quittances,
    devis,
    clients,
    vehicules,
    loading,
    error,
    selectedQuittance,
    fetchQuittances,
    fetchDevis,
    fetchClients,
    fetchVehicules,
    createQuittance,
    updateQuittance,
    deleteQuittance,
    enregistrerPaiement,
    setSelectedQuittance,
    clearError,
  } = useQuittanceStore();

  const quittanceModal = useModal();
  const deleteModal = useModal();
  const paymentModal = useModal();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchQuittances();
    fetchDevis();
    fetchClients();
    fetchVehicules();
  }, []);

  const handleCreateQuittance = async (formData: QuittanceFormData) => {
    try {
      await createQuittance(formData);
      quittanceModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleUpdateQuittance = async (formData: QuittanceFormData) => {
    if (!selectedQuittance) return;
    try {
      await updateQuittance(selectedQuittance.id, formData);
      quittanceModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleDeleteQuittance = async () => {
    if (!selectedQuittance) return;
    try {
      await deleteQuittance(selectedQuittance.id);
      deleteModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handlePayment = async (paymentData: PaymentData) => {
    if (!selectedQuittance) return;
    try {
      await enregistrerPaiement(selectedQuittance.id, paymentData);
      paymentModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const openEditModal = (quittance: Quittance) => {
    setSelectedQuittance(quittance);
    setIsEditing(true);
    quittanceModal.openModal();
  };

  const openCreateModal = () => {
    setSelectedQuittance(null);
    setIsEditing(false);
    quittanceModal.openModal();
  };

  const openDeleteModal = (quittance: Quittance) => {
    setSelectedQuittance(quittance);
    deleteModal.openModal();
  };

  const openPaymentModal = (quittance: Quittance) => {
    setSelectedQuittance(quittance);
    paymentModal.openModal();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPaymentStatusColor = (quittance: Quittance): "success" | "warning" | "error" => {
    if (quittance.solde === 0) return "success";
    if (quittance.montant_encaisse > 0) return "warning";
    return "error";
  };

  const getPaymentStatusText = (quittance: Quittance) => {
    if (quittance.solde === 0) return "Payé";
    if (quittance.montant_encaisse > 0) return "Partiel";
    return "Impayé";
  };

  if (loading && quittances.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des quittances...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="rounded-xl border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10 p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-error-500 dark:text-error-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-error-800 dark:text-error-300">
                Erreur
              </h3>
              <p className="mt-1 text-sm text-error-700 dark:text-error-400">
                {error}
              </p>
              <button
                onClick={() => {
                  clearError();
                  fetchQuittances();
                }}
                className="mt-3 text-sm font-medium text-error-600 dark:text-error-300 hover:text-error-800 dark:hover:text-error-200"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des quittances
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {quittances.length} quittance{quittances.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          startIcon={<AddIcon />}
        >
          Nouvelle quittance
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Quittance
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Devis
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Client
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Montants
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Statut
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {quittances.map((quittance) => (
                <TableRow key={quittance.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            Q
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Quittance #{quittance.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Mode: {quittance.mode_paiement}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge color="info" variant="light" size="md">
                      Devis #{quittance.fk_devis_id}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {quittance.client?.nom_complet || `Client ID: ${quittance.fk_client_id}`}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Véhicule: {quittance.vehicule?.matricule || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(quittance.prime_total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Payé:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(quittance.montant_encaisse)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Solde:</span>
                        <span className={`font-medium ${quittance.solde > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                          {formatCurrency(quittance.solde)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      color={getPaymentStatusColor(quittance)}
                      variant="light"
                      size="md"
                      className="font-medium"
                    >
                      {getPaymentStatusText(quittance)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {quittance.solde > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPaymentModal(quittance)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <PaymentIcon />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(quittance)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <EditIcon />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteModal(quittance)}
                        className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:text-error-300"
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Quittance Form Modal */}
      <QuittanceFormModal
        isOpen={quittanceModal.isOpen}
        onClose={quittanceModal.closeModal}
        onSubmit={isEditing ? handleUpdateQuittance : handleCreateQuittance}
        initialData={
          selectedQuittance
            ? {
              fk_devis_id: selectedQuittance.fk_devis_id,
              fk_vehicule_id: selectedQuittance.fk_vehicule_id,
              fk_client_id: selectedQuittance.fk_client_id,
              prime_total: selectedQuittance.prime_total,
              montant_encaisse: selectedQuittance.montant_encaisse,
              solde: selectedQuittance.solde,
              mode_paiement: selectedQuittance.mode_paiement,
            }
            : undefined
        }
        devis={devis}
        clients={clients}
        vehicules={vehicules}
        isEditing={isEditing}
        loading={loading}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteQuittance}
        quittanceId={selectedQuittance?.id || 0}
        loading={loading}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={paymentModal.closeModal}
        onConfirm={handlePayment}
        quittance={selectedQuittance}
        loading={loading}
      />
    </div>
  );
}
