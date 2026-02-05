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
import { DevisFormModal } from "./DevisFormModal";
import { DeleteModal } from "./DeleteModal";
import { useDevisStore } from "../../store/devisStore";
import { DevisFormData, Devis } from "../../types/devis";
import useAuthStore from "@/store/authStore";

// Icons professionnels
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

const FileIcon = () => (
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
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

const QuittanceIcon = () => (
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

export default function DevisTable() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const {
    devis,
    clients,
    vehicules,
    polices,
    loading,
    error,
    selectedDevis,
    fetchDevis,
    fetchClients,
    fetchVehicules,
    fetchPolices,
    createDevis,
    updateDevis,
    deleteDevis,
    genererQuittance,
    setSelectedDevis,
    clearError,
  } = useDevisStore();

  const devisModal = useModal();
  const deleteModal = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    fetchDevis();
    fetchClients();
    fetchVehicules();
    fetchPolices();
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

  const sortedDevis = [...devis].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    switch (key) {
      case "num_devis":
        aValue = a.num_devis;
        bValue = b.num_devis;
        break;
      case "prime_total":
        aValue = a.prime_total;
        bValue = b.prime_total;
        break;
      case "statut":
        aValue = getStatusLabel(a.statut);
        bValue = getStatusLabel(b.statut);
        break;
      case "date_effet":
        aValue = new Date(a.date_effet || "").getTime();
        bValue = new Date(b.date_effet || "").getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const getClientForDevis = (devisItem: Devis) => {
    if (devisItem.client) return devisItem.client;
    if (devisItem.fk_client_id) {
      const foundClient = clients.find(
        (client) => client.id === devisItem.fk_client_id,
      );
      if (foundClient) return foundClient;
    }
    if (devisItem.fk_police_id) {
      const police = polices.find((p) => p.id === devisItem.fk_police_id);
      if (police && police.fk_client_id) {
        const foundClient = clients.find(
          (client) => client.id === police.fk_client_id,
        );
        if (foundClient) return foundClient;
      }
    }
    return null;
  };

  const handleCreateDevis = async (formData: DevisFormData) => {
    try {
      await createDevis(formData);
      devisModal.closeModal();
    } catch (error) {
      console.error("Erreur création devis:", error);
    }
  };

  const handleUpdateDevis = async (formData: DevisFormData) => {
    if (!selectedDevis) return;
    try {
      await updateDevis(selectedDevis.id, formData);
      devisModal.closeModal();
    } catch (error) {
      console.error("Erreur mise à jour devis:", error);
    }
  };

  const handleDeleteDevis = async () => {
    if (!selectedDevis) return;
    try {
      await deleteDevis(selectedDevis.id);
      deleteModal.closeModal();
    } catch (error) {
      console.error("Erreur suppression devis:", error);
    }
  };

  const handleGenererQuittance = async (devisId: number) => {
    try {
      await genererQuittance(devisId);
      alert("Quittance générée avec succès !");
    } catch (error: any) {
      alert(error.message || "Erreur lors de la génération de la quittance");
    }
  };

  const openEditModal = (devis: Devis) => {
    setSelectedDevis(devis);
    setIsEditing(true);
    devisModal.openModal();
  };

  const openCreateModal = () => {
    setSelectedDevis(null);
    setIsEditing(false);
    devisModal.openModal();
  };

  const openDeleteModal = (devis: Devis) => {
    setSelectedDevis(devis);
    deleteModal.openModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (
    statut?: string,
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    if (!statut) return "info";
    const colors: Record<
      string,
      "success" | "warning" | "error" | "info" | "neutral"
    > = {
      accepte: "success",
      en_attente: "warning",
      refuse: "error",
      expire: "neutral",
    };
    return colors[statut] || "info";
  };

  const getStatusLabel = (statut?: string) => {
    if (!statut) return "En attente";
    const labels: Record<string, string> = {
      accepte: "Accepté",
      en_attente: "En attente",
      refuse: "Refusé",
      expire: "Expiré",
    };
    return labels[statut] || statut;
  };

  if (loading && devis.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Chargement des devis...
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
                  fetchDevis();
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
            Devis
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {devis.length} devis au total • Gestion des propositions
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white transition-colors"
        >
          Nouveau devis
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-700">
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("num_devis")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Numéro
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <div className="font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                    Client
                  </div>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("prime_total")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Montant
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("date_effet")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Période
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
              {sortedDevis.map((devisItem) => {
                const client = getClientForDevis(devisItem);
                const hasQuittance = !!devisItem.quittance;
                const isAccepte = devisItem.statut === "accepte";

                return (
                  <TableRow
                    key={devisItem.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-auto h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="font-bold text-gray-900 dark:text-white text-sm  p-2">
                              
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {devisItem.num_devis}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {devisItem.id}
                            </div>
                          </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {client
                            ? client.nom_complet
                            : `Client ID: ${devisItem.fk_client_id}`}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {client
                            ? `CIN: ${client.cin}`
                            : `ID: ${devisItem.fk_client_id}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(devisItem.prime_total)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-0.5">
                        <div className="text-sm text-gray-900 dark:text-gray-300">
                          Du {formatDate(devisItem.date_effet)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Au {formatDate(devisItem.date_echeance)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-2">
                        <Badge
                          color={getStatusColor(devisItem.statut)}
                          variant="light"
                          size="sm"
                          className="font-medium"
                        >
                          {getStatusLabel(devisItem.statut)}
                        </Badge>
                        {hasQuittance && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Quittance générée</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(devisItem)}
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 p-2"
                          title="Modifier"
                        >
                          <EditIcon />
                        </Button>

                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteModal(devisItem)}
                            className="text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 p-2"
                            title="Supprimer"
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {devis.length === 0 && !loading && (
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
              Aucun devis
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Créez votre premier devis pour commencer
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
              startIcon={<AddIcon />}
            >
              Créer un devis
            </Button>
          </div>
        )}

        {/* Pagination/Info Footer */}
        {devis.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Affichage de <span className="font-medium">{devis.length}</span>{" "}
                devis
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
      <DevisFormModal
        isOpen={devisModal.isOpen}
        onClose={devisModal.closeModal}
        onSubmit={isEditing ? handleUpdateDevis : handleCreateDevis}
        initialData={
          selectedDevis
            ? {
                num_devis: selectedDevis.num_devis,
                prime_total: selectedDevis.prime_total,
                date_effet: selectedDevis.date_effet,
                date_echeance: selectedDevis.date_echeance,
                statut: selectedDevis.statut || "en_attente",
                fk_client_id: selectedDevis.fk_client_id,
                fk_vehicule_id: selectedDevis.fk_vehicule_id,
                fk_police_id: selectedDevis.fk_police_id,
              }
            : undefined
        }
        clients={clients}
        vehicules={vehicules}
        polices={polices}
        isEditing={isEditing}
        loading={loading}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteDevis}
        devisNum={selectedDevis?.num_devis || ""}
        loading={loading}
      />
    </div>
  );
}
