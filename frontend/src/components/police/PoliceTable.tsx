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
import { PoliceFormModal } from "./PoliceFormModal";
import { DeleteModal } from "./DeleteModal";
import { usePoliceStore } from "../../store/policeStore";
import { PoliceFormData, Police } from "../../types/police";

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

const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function PoliceTable() {
  const {
    polices,
    clients,
    loading,
    error,
    selectedPolice,
    fetchPolices,
    fetchClients,
    createPolice,
    updatePolice,
    deletePolice,
    setSelectedPolice,
    clearError,
  } = usePoliceStore();

  const policeModal = useModal();
  const deleteModal = useModal();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPolices();
    fetchClients();
  }, []);

  const handleCreatePolice = async (formData: PoliceFormData) => {
    try {
      await createPolice(formData);
      policeModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleUpdatePolice = async (formData: PoliceFormData) => {
    if (!selectedPolice) return;
    try {
      await updatePolice(selectedPolice.id, formData);
      policeModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleDeletePolice = async () => {
    if (!selectedPolice) return;
    try {
      await deletePolice(selectedPolice.id);
      deleteModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const openEditModal = (police: Police) => {
    setSelectedPolice(police);
    setIsEditing(true);
    policeModal.openModal();
  };

  const openCreateModal = () => {
    setSelectedPolice(null);
    setIsEditing(false);
    policeModal.openModal();
  };

  const openDeleteModal = (police: Police) => {
    setSelectedPolice(police);
    deleteModal.openModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && polices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des polices...
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
                  fetchPolices();
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
            Gestion des polices
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {polices.length} police{polices.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          startIcon={<AddIcon />}
        >
          Nouvelle police
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Numéro de police
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Client
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Date de souscription
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {polices.map((police) => (
                <TableRow key={police.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            P
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {police.num_police}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {police.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge color="info" variant="light" size="md">
                      {police.client?.nom_complet || `Client ID: ${police.fk_client_id}`}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {formatDate(police.date_souscription)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(police)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        <EditIcon />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success-600 hover:text-success-700 hover:bg-success-50 dark:text-success-400 dark:hover:text-success-300"
                        onClick={() => {
                          // TODO: Naviguer vers les devis de cette police
                        }}
                      >
                        <DocumentIcon />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteModal(police)}
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

      {/* Police Form Modal */}
      <PoliceFormModal
        isOpen={policeModal.isOpen}
        onClose={policeModal.closeModal}
        onSubmit={isEditing ? handleUpdatePolice : handleCreatePolice}
        initialData={
          selectedPolice
            ? {
              num_police: selectedPolice.num_police,
              date_souscription: selectedPolice.date_souscription,
              fk_client_id: selectedPolice.fk_client_id,
            }
            : undefined
        }
        clients={clients}
        isEditing={isEditing}
        loading={loading}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeletePolice}
        policeNum={selectedPolice?.num_police || ""}
        loading={loading}
      />
    </div>
  );
}
