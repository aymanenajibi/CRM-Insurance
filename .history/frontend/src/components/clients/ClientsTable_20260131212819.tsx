// components/clients/ClientsTable.tsx
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
import { ClientFormModal } from "./ClientFormModal";
import { DeleteModal } from "./DeleteModal";
import { useClientStore } from "../stores/clientStore";
import { ClientFormData } from "../../types/client";

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

const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function ClientsTable() {
  const {
    clients,
    loading,
    error,
    selectedClient,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    setSelectedClient,
    clearError,
  } = useClientStore();

  const clientModal = useModal();
  const deleteModal = useModal();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (formData: ClientFormData) => {
    try {
      await createClient(formData);
      clientModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleUpdateClient = async (formData: ClientFormData) => {
    if (!selectedClient) return;
    try {
      await updateClient(selectedClient.id, formData);
      clientModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient.id);
      deleteModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(true);
    clientModal.openModal();
  };

  const openCreateModal = () => {
    setSelectedClient(null);
    setIsEditing(false);
    clientModal.openModal();
  };

  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
    deleteModal.openModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateNaissance = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getPermisColor = (typePermis: string) => {
    const colors: Record<string, "blue" | "green" | "yellow" | "purple" | "orange"> = {
      "A": "blue",
      "B": "green",
      "C": "yellow",
      "D": "purple",
      "E": "orange",
    };
    return colors[typePermis] || "gray";
  };

  const getPermisLabel = (typePermis: string) => {
    const labels: Record<string, string> = {
      "A": "A - Moto",
      "B": "B - Voiture",
      "C": "C - Poids lourd",
      "D": "D - Transport",
      "E": "E - Attelé",
    };
    return labels[typePermis] || typePermis;
  };

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des clients...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Erreur</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => { clearError(); fetchClients(); }}
                className="mt-3 text-sm font-medium text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
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
            Gestion des clients
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {clients.length} client{clients.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          startIcon={<AddIcon />}
        >
          Nouveau client
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Client
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  CIN
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Âge
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Ville
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Permis
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Date d'inscription
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-600 dark:from-blue-600 dark:to-teal-700 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {client.nom_complet.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {client.nom_complet}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {client.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge color="blue" className="font-mono">
                      {client.cin}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="text-gray-700 dark:text-gray-300">
                      {calculateAge(client.date_naissance)} ans
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateNaissance(client.date_naissance)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-700 dark:text-gray-300">
                    {client.ville}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      color={getPermisColor(client.type_permis)}
                      className="font-medium"
                    >
                      {getPermisLabel(client.type_permis)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {formatDate(client.created_at)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(client)}
                        title="Modifier"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <EditIcon />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        title="Documents"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300"
                        onClick={() => {/* TODO: Naviguer vers les documents */}}
                      >
                        <DocumentIcon />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteModal(client)}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
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

      {/* Client Form Modal */}
      <ClientFormModal
        isOpen={clientModal.isOpen}
        onClose={clientModal.closeModal}
        onSubmit={isEditing ? handleUpdateClient : handleCreateClient}
        initialData={selectedClient ? {
          nom_complet: selectedClient.nom_complet,
          cin: selectedClient.cin,
          date_naissance: selectedClient.date_naissance,
          ville: selectedClient.ville,
          type_permis: selectedClient.type_permis,
        } : undefined}
        isEditing={isEditing}
        loading={loading}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteClient}
        clientName={selectedClient?.nom_complet || ""}
        loading={loading}
      />
    </div>
  );
}