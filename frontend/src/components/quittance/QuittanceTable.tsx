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
import { UpdatePaymentStatusModal } from "./UpdatePaymentStatusModal";
import { useQuittanceStore } from "../../store/quittanceStore";
import {
  QuittanceFormData,
  Quittance,
  PaymentData,
} from "../../types/quittance";
import useAuthStore from "@/store/authStore";

// Icons - Version plus professionnelle
const AddIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const PaymentIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    />
  </svg>
);

const StatusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.801 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    className="w-4 h-4 ml-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
    />
  </svg>
);

export default function QuittanceTable() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
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
    updatePaymentStatus,
    setSelectedQuittance,
    clearError,
  } = useQuittanceStore();

  const quittanceModal = useModal();
  const deleteModal = useModal();
  const paymentModal = useModal();
  const updateStatusModal = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchDevis(), fetchClients(), fetchVehicules()]);
      await fetchQuittances();
    };
    loadData();
  }, []);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedQuittances = [...quittances].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    switch (key) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "prime_total":
        aValue = a.prime_total;
        bValue = b.prime_total;
        break;
      case "statut":
        aValue = getPaymentStatusText(a);
        bValue = getPaymentStatusText(b);
        break;
      case "created_at":
        aValue = new Date(a.created_at || "").getTime();
        bValue = new Date(b.created_at || "").getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleCreateQuittance = async (formData: QuittanceFormData) => {
    try {
      // Empêcher la création manuelle - message informatif
      alert(
        "Les quittances sont créées automatiquement lors de la création d'un devis. \n\nCréez d'abord un devis pour générer une quittance.",
      );
      quittanceModal.closeModal();
      return;

      // Code original (gardé pour référence mais jamais exécuté) :
      // await createQuittance(formData);
      // quittanceModal.closeModal();
    } catch (error) {}
  };

  const handleUpdateQuittance = async (formData: QuittanceFormData) => {
    if (!selectedQuittance) return;
    try {
      await updateQuittance(selectedQuittance.id, formData);
      quittanceModal.closeModal();
    } catch (error) {}
  };

  const handleDeleteQuittance = async () => {
    if (!selectedQuittance) return;
    try {
      await deleteQuittance(selectedQuittance.id);
      deleteModal.closeModal();
    } catch (error) {}
  };

  const handlePayment = async (paymentData: PaymentData) => {
    if (!selectedQuittance) return;
    try {
      await enregistrerPaiement(selectedQuittance.id, paymentData);
      paymentModal.closeModal();
    } catch (error) {}
  };

  const openEditModal = (quittance: Quittance) => {
    setSelectedQuittance(quittance);
    setIsEditing(true);
    quittanceModal.openModal();
  };

  const openCreateModal = () => {
    // Empêcher l'ouverture du modal de création
    alert(
      "Les quittances sont créées automatiquement avec les devis.\n\nCréez d'abord un devis pour générer une quittance.",
    );
    return;

    // Code original (gardé pour référence) :
    // setSelectedQuittance(null);
    // setIsEditing(false);
    // quittanceModal.openModal();
  };

  const openDeleteModal = (quittance: Quittance) => {
    setSelectedQuittance(quittance);
    deleteModal.openModal();
  };

  const openPaymentModal = (quittance: Quittance) => {
    setSelectedQuittance(quittance);
    paymentModal.openModal();
  };

  const openUpdateStatusModal = (quittance: Quittance) => {
    setSelectedQuittance(quittance);
    updateStatusModal.openModal();
  };

  const handleUpdateStatus = async (statusData: {
    statut_paiement: string;
    montant_encaisse?: number;
    solde?: number;
  }) => {
    if (!selectedQuittance) return;
    try {
      await updatePaymentStatus(selectedQuittance.id, statusData);
      updateStatusModal.closeModal();
    } catch (error) {}
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatQuittanceId = (id: number) => `Q${id}`;
  const formatDevisId = (id: number) => `D${id}`;

  const getPaymentStatusColor = (
    quittance: Quittance,
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    const statut = quittance.statut_paiement?.toLowerCase() || "";
    switch (statut) {
      case "payé":
        return "success";
      case "partiel":
      case "partiellement payé":
        return "warning";
      case "impayé":
        return "error";
      case "en_attente":
      case "en attente":
        return "info";
      case "annulé":
        return "neutral";
      case "remboursé":
        return "info";
      default:
        return "neutral";
    }
  };

  const getPaymentStatusText = (quittance: Quittance) => {
    if (quittance.statut_paiement) return quittance.statut_paiement;
    if (quittance.solde === 0) return "Payé";
    else if (quittance.montant_encaisse > 0) return "Partiel";
    else return "Impayé";
  };

  const getDisplayNumDevis = (quittance: Quittance) => {
    if (quittance.devis?.num_devis) return quittance.devis.num_devis;
    return formatDevisId(quittance.fk_devis_id);
  };

  const shouldShowPaymentButton = (quittance: Quittance) => {
    const statut = quittance.statut_paiement?.toLowerCase() || "";
    if (statut === "annulé" || statut === "remboursé" || statut === "payé") {
      return false;
    }
    return quittance.solde > 0;
  };

  if (loading && quittances.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">
                Erreur de chargement
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
              <button
                onClick={() => {
                  clearError();
                  fetchQuittances();
                }}
                className="mt-3 text-sm font-medium text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-colors"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quittances
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {quittances.length} quittance{quittances.length > 1 ? "s" : ""} ·
            Gestion des paiements
          </p>
        </div>

        {/* Bouton DÉSACTIVÉ en NOIR avec badge "Auto" */}
        <div className="relative inline-block">
          <Button
            onClick={openCreateModal}
            className="bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white transition-colors opacity-70 cursor-not-allowed"
            disabled={true}
            title="Les quittances sont créées automatiquement avec les devis"
          >
            Nouvelle quittance
          </Button>
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Auto
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-700">
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    N° Quittance
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <div className="font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                    Client & Véhicule
                  </div>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("prime_total")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Montants
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("statut")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Statut
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <div className="font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs text-right">
                    Actions
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sortedQuittances.map((quittance) => (
                <TableRow
                  key={quittance.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <TableCell className="py-4 px-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {formatQuittanceId(quittance.id)}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Paiement :
                            {quittance.mode_paiement || "Non spécifié"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {quittance.created_at && (
                          <>
                            Créé le{" "}
                            {new Date(quittance.created_at).toLocaleDateString(
                              "fr-FR",
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <div className="space-y-1.5">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {quittance.client?.nom_complet ||
                            `Client ${formatDevisId(quittance.fk_client_id)}`}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {quittance.client?.cin &&
                            `CIN: ${quittance.client.cin}`}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Véhicule: {quittance.vehicule?.matricule || "N/A"}
                      </div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Devis: {getDisplayNumDevis(quittance)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(quittance.prime_total)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Payé:
                        </span>
                        <span
                          className={`font-medium ${
                            quittance.statut_paiement === "annulé" ||
                            quittance.statut_paiement === "remboursé"
                              ? "text-gray-500 dark:text-gray-400"
                              : "text-green-700 dark:text-green-400"
                          }`}
                        >
                          {formatCurrency(quittance.montant_encaisse)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Solde:
                        </span>
                        <span
                          className={`font-medium ${
                            quittance.statut_paiement === "annulé" ||
                            quittance.statut_paiement === "remboursé"
                              ? "text-gray-500 dark:text-gray-400"
                              : quittance.solde > 0
                                ? "text-amber-700 dark:text-amber-400"
                                : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {formatCurrency(quittance.solde)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <div className="space-y-2">
                      <Badge
                        color={getPaymentStatusColor(quittance)}
                        variant="light"
                        size="sm"
                        className="font-medium"
                      >
                        {getPaymentStatusText(quittance)}
                      </Badge>
                      {quittance.prime_total > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Progression</span>
                            <span>
                              {Math.round(
                                (quittance.montant_encaisse /
                                  quittance.prime_total) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-300"
                              style={{
                                width: `${(quittance.montant_encaisse / quittance.prime_total) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <div className="flex items-center justify-end gap-1">
                      {shouldShowPaymentButton(quittance) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openPaymentModal(quittance)}
                          className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 p-2"
                          title="Enregistrer un paiement"
                        >
                          <PaymentIcon />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openUpdateStatusModal(quittance)}
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 p-2"
                        title="Modifier le statut"
                      >
                        <StatusIcon />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(quittance)}
                        disabled={
                          quittance.statut_paiement === "annulé" ||
                          quittance.statut_paiement === "remboursé"
                        }
                        className={`p-2 ${
                          quittance.statut_paiement === "annulé" ||
                          quittance.statut_paiement === "remboursé"
                            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                        title={
                          quittance.statut_paiement === "annulé" ||
                          quittance.statut_paiement === "remboursé"
                            ? "Modification impossible"
                            : "Modifier"
                        }
                      >
                        <EditIcon />
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteModal(quittance)}
                          className="text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 p-2"
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {quittances.length === 0 && !loading && (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Aucune quittance
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Commencez par créer votre première quittance
            </p>
            <div className="relative inline-block">
              <Button
                onClick={openCreateModal}
                className="bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white opacity-70 cursor-not-allowed"
                disabled={true}
                title="Les quittances sont créées automatiquement avec les devis"
              >
                Créer une quittance
              </Button>
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Auto
              </div>
            </div>
          </div>
        )}

        {/* Pagination/Info Footer */}
        {quittances.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Affichage de{" "}
                <span className="font-medium">{quittances.length}</span>{" "}
                quittance{quittances.length > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                  Précédent
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
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

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteQuittance}
        quittanceId={selectedQuittance?.id || 0}
        loading={loading}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={paymentModal.closeModal}
        onConfirm={handlePayment}
        quittance={selectedQuittance}
        loading={loading}
      />

      <UpdatePaymentStatusModal
        isOpen={updateStatusModal.isOpen}
        onClose={updateStatusModal.closeModal}
        onConfirm={handleUpdateStatus}
        quittance={selectedQuittance}
        loading={loading}
      />
    </div>
  );
}
