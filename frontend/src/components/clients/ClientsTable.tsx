// ClientTable.tsx
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
import { useClientStore } from "../../store/clientStore";
import { ClientFormData, Client } from "../../types/client";
import useAuthStore from "../../store/authStore";

// Icons
const AddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const IDCardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.997 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
);

export default function ClientTable() {

const { user } = useAuthStore();
const isAdmin = user?.role === "admin";

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
// Vérifier si l'utilisateur est admin

  const clientModal = useModal();
  const deleteModal = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    switch (key) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'nom_complet':
        aValue = a.nom_complet.toLowerCase();
        bValue = b.nom_complet.toLowerCase();
        break;
      case 'cin':
        aValue = a.cin.toLowerCase();
        bValue = b.cin.toLowerCase();
        break;
      case 'date_naissance':
        aValue = new Date(a.date_naissance || '').getTime();
        bValue = new Date(b.date_naissance || '').getTime();
        break;
      case 'ville':
        aValue = a.ville.toLowerCase();
        bValue = b.ville.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

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

  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatClientId = (id: number) => `C${id}`;

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Chargement des clients...
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
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                  fetchClients();
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
            Clients
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {clients.length} client{clients.length > 1 ? "s" : ""} · Gestion des assurés
          </p>
        </div>

        {/* Bouton Nouveau client */}
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-colors shadow-sm"
        >
          Nouveau client
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
                    onClick={() => handleSort('id')}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Client
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort('cin')}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    CIN
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <button
                    onClick={() => handleSort('date_naissance')}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Âge / Naissance
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <div className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                    Informations
                  </div>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <div className="font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs text-right">
                    Actions
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sortedClients.map((client) => {
                const age = calculateAge(client.date_naissance);
                return (
                  <TableRow key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center">
                            <span className="font-bold text-blue-700 dark:text-blue-400 text-sm">
                              <UserIcon />
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {client.nom_complet}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {formatClientId(client.id)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <IDCardIcon className="text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {client.cin}
                          </div>
                          <Badge color="info" variant="light" size="xs" className="font-medium">
                            Carte d'identité
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <CalendarIcon />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {age} ans
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(client.date_naissance)}
                        </div>
                        <Badge color={age < 25 ? "warning" : "success"} variant="light" size="xs" className="font-medium">
                          {age < 25 ? "Jeune conducteur" : "Conducteur expérimenté"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <LocationIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {client.ville}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Permis: {client.type_permis}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {client.created_at && (
                            <>Inscrit le {new Date(client.created_at).toLocaleDateString('fr-FR')}</>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // TODO: Naviguer vers les polices de ce client
                            console.log('Voir les polices pour le client:', client.id);
                          }}
                          className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 p-2"
                          title="Voir les polices"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(client)}
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 p-2"
                          title="Modifier"
                        >
                          <EditIcon />
                        </Button>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteModal(client)}
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

        {clients.length === 0 && !loading && (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Aucun client
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Commencez par créer votre premier client
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
              startIcon={<AddIcon />}
            >
              Créer un client
            </Button>
          </div>
        )}

        {/* Pagination/Info Footer */}
        {clients.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Affichage de <span className="font-medium">{clients.length}</span> client{clients.length > 1 ? 's' : ''}
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

      {/* Client Form Modal */}
      <ClientFormModal
        isOpen={clientModal.isOpen}
        onClose={clientModal.closeModal}
        onSubmit={isEditing ? handleUpdateClient : handleCreateClient}
        initialData={
          selectedClient
            ? {
                nom_complet: selectedClient.nom_complet,
                cin: selectedClient.cin,
                date_naissance: selectedClient.date_naissance,
                ville: selectedClient.ville,
                type_permis: selectedClient.type_permis,
              }
            : undefined
        }
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
