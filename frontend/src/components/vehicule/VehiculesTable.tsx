import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { VehiculeFormModal } from "./VehiculeFormModal";
import { DeleteModal } from "./DeleteModal";
import { useVehiculeStore } from "../../store/vehiculeStore";
import { useClientStore } from "../../store/clientStore";
import { Vehicule } from "../../types/vehicule";
import useAuthStore from "@/store/authStore";

// Icons
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

const CarIcon = () => (
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
      d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
    />
  </svg>
);

const MoneyIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const PowerIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
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

const CalendarIcon = () => (
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
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

export default function VehiculeTable() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const {
    vehicules,
    isLoading: loading,
    error,
    fetchVehicules,
    addVehicule,
    updateVehicule,
    deleteVehicule,
  } = useVehiculeStore();

  const { clients, fetchClients } = useClientStore();

  const vehiculeModal = useModal();
  const deleteModal = useModal();

  const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchClients();
      await fetchVehicules();
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

  const sortedVehicules = [...vehicules].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    switch (key) {
      case "matricule":
        aValue = a.matricule;
        bValue = b.matricule;
        break;
      case "marque":
        aValue = a.marque;
        bValue = b.marque;
        break;
      case "date_mise_en_circulation":
        aValue = new Date(a.date_mise_en_circulation || "").getTime();
        bValue = new Date(b.date_mise_en_circulation || "").getTime();
        break;
      case "client":
        aValue = a.client?.nom_complet || "";
        bValue = b.client?.nom_complet || "";
        break;
      case "valeur_venale":
        aValue = a.valeur_venale;
        bValue = b.valeur_venale;
        break;
      case "puissance_fiscale":
        aValue = a.puissance_fiscale;
        bValue = b.puissance_fiscale;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleCreateVehicule = async (formData: any) => {
    try {
      await addVehicule(formData);
      vehiculeModal.closeModal();
    } catch (error) {}
  };

  const handleUpdateVehicule = async (formData: any) => {
    if (!selectedVehicule) return;
    try {
      await updateVehicule(selectedVehicule.id, formData);
      vehiculeModal.closeModal();
    } catch (error) {}
  };

  const handleDeleteVehicule = async () => {
    if (!selectedVehicule) return;
    try {
      await deleteVehicule(selectedVehicule.id);
      deleteModal.closeModal();
    } catch (error) {}
  };

  const openEditModal = (vehicule: Vehicule) => {
    setSelectedVehicule(vehicule);
    setIsEditing(true);
    vehiculeModal.openModal();
  };

  const openCreateModal = () => {
    setSelectedVehicule(null);
    setIsEditing(false);
    vehiculeModal.openModal();
  };

  const openDeleteModal = (vehicule: Vehicule) => {
    setSelectedVehicule(vehicule);
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
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getClientInfo = (vehicule: Vehicule) => {
    if (vehicule.client) {
      return {
        name: vehicule.client.nom_complet,
        cin: vehicule.client.cin || "",
        phone: vehicule.client.telephone || "",
      };
    }
    return {
      name: "Non assigné",
      cin: "",
      phone: "",
    };
  };

  if (loading && vehicules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Chargement des véhicules...
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
                  fetchVehicules();
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
            Véhicules
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {vehicules.length} véhicule{vehicules.length > 1 ? "s" : ""} ·
            Gestion du parc automobile
          </p>
        </div>

        {/* Bouton Nouveau véhicule */}
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-colors shadow-sm"
        >
          Nouveau véhicule
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
                    onClick={() => handleSort("matricule")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Véhicule
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("marque")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Marque/Modèle
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("client")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Propriétaire
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("valeur_venale")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Valeur vénale
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("puissance_fiscale")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Puissance
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort("date_mise_en_circulation")}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Mise en circ.
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
              {sortedVehicules.map((vehicule) => {
                const clientInfo = getClientInfo(vehicule);
                const dateMiseEnCirculation = new Date(
                  vehicule.date_mise_en_circulation,
                );
                const maintenant = new Date();
                const ageEnAnnees =
                  maintenant.getFullYear() -
                  dateMiseEnCirculation.getFullYear();

                return (
                  <TableRow
                    key={vehicule.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                            <CarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-blue-600 dark:text-blue-400">
                              {vehicule.matricule}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white uppercase text-sm">
                            {vehicule.marque}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Modèle: {vehicule.model}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {clientInfo.name}
                          </div>
                          {clientInfo.cin && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              CIN: {clientInfo.cin}
                            </div>
                          )}
                        </div>
                        {clientInfo.phone && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            📞 {clientInfo.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <MoneyIcon />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(vehicule.valeur_venale)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Valeur estimée
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <PowerIcon />
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {vehicule.puissance_fiscale}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              CV
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Puissance fiscale
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <CalendarIcon />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatDate(vehicule.date_mise_en_circulation)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {ageEnAnnees} an{ageEnAnnees > 1 ? "s" : ""}{" "}
                          d'ancienneté
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(vehicule)}
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 p-2"
                          title="Modifier"
                        >
                          <EditIcon />
                        </Button>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteModal(vehicule)}
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

        {vehicules.length === 0 && !loading && (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Aucun véhicule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Commencez par enregistrer votre premier véhicule
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm"
              startIcon={<AddIcon />}
            >
              Ajouter un véhicule
            </Button>
          </div>
        )}

        {/* Pagination/Info Footer */}
        {vehicules.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Affichage de{" "}
                <span className="font-medium">{vehicules.length}</span> véhicule
                {vehicules.length > 1 ? "s" : ""}
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
      <VehiculeFormModal
        isOpen={vehiculeModal.isOpen}
        onClose={vehiculeModal.closeModal}
        onSubmit={isEditing ? handleUpdateVehicule : handleCreateVehicule}
        initialData={selectedVehicule}
        clients={clients}
        isEditing={isEditing}
        loading={loading}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteVehicule}
        itemName={selectedVehicule?.matricule || ""}
        loading={loading}
      />
    </div>
  );
}
