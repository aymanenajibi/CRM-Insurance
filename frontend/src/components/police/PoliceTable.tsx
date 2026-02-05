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

// Icons - Version plus professionnelle (identique à QuittanceTable)
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

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchClients();
      await fetchPolices();
    };
    loadData();
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPolices = [...polices].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    switch (key) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'num_police':
        aValue = a.num_police;
        bValue = b.num_police;
        break;
      case 'date_souscription':
        aValue = new Date(a.date_souscription || '').getTime();
        bValue = new Date(b.date_souscription || '').getTime();
        break;
      case 'client':
        aValue = a.client?.nom_complet || '';
        bValue = b.client?.nom_complet || '';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

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

  const formatPoliceId = (id: number) => `P${id}`;

  const getClientInfo = (police: Police) => {
    if (police.client) {
      return {
        name: police.client.nom_complet,
        cin: police.client.cin || '',
        phone: police.client.telephone || ''
      };
    }
    return {
      name: `Client ${police.fk_client_id}`,
      cin: '',
      phone: ''
    };
  };

  if (loading && polices.length === 0) {
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
                  fetchPolices();
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
            Polices
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {polices.length} police{polices.length > 1 ? "s" : ""} · Gestion des contrats d'assurance
          </p>
        </div>

        {/* Bouton Nouvelle police */}
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors shadow-sm"
        >
          Nouvelle police
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-700">
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableCell isHeader className="py-3 px-5">
                  <button
                    onClick={() => handleSort('id')}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    N° Police
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell isHeader className="py-3 px-5">
                  <button
                    onClick={() => handleSort('client')}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Client
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell isHeader className="py-3 px-5">
                  <button
                    onClick={() => handleSort('date_souscription')}
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Souscription
                    <SortIcon />
                  </button>
                </TableCell>
                <TableCell isHeader className="py-3 px-5">
                  <div className="font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                    Informations
                  </div>
                </TableCell>
                <TableCell isHeader className="py-3 px-5">
                  <div className="font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs text-right">
                    Actions
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sortedPolices.map((police) => {
                const clientInfo = getClientInfo(police);
                return (
                  <TableRow key={police.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center">
                            <span className="font-bold text-purple-700 dark:text-purple-400 text-sm">
                              P
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {police.num_police}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {formatPoliceId(police.id)}
                            </div>
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
                          <CalendarIcon />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatDate(police.date_souscription)}
                          </span>
                        </div>
                        <Badge color="info" variant="light" size="xs" className="font-medium">
                          Souscrite
                        </Badge>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(police.date_souscription).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Client ID:</span> {police.fk_client_id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {police.created_at && (
                            <>Créée le {new Date(police.created_at).toLocaleDateString('fr-FR')}</>
                          )}
                        </div>
                        {police.updated_at && police.updated_at !== police.created_at && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Modifiée le {new Date(police.updated_at).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // TODO: Naviguer vers les devis de cette police
                            console.log('Voir les devis pour la police:', police.id);
                          }}
                          className="text-purple-700 hover:text-purple-800 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 p-2"
                          title="Voir les devis"
                        >
                          <DocumentIcon />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(police)}
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 p-2"
                          title="Modifier"
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteModal(police)}
                          className="text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 p-2"
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {polices.length === 0 && !loading && (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Aucune police
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Commencez par créer votre première police d'assurance
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm"
              startIcon={<AddIcon />}
            >
              Créer une police
            </Button>
          </div>
        )}

        {/* Pagination/Info Footer */}
        {polices.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Affichage de <span className="font-medium">{polices.length}</span> police{polices.length > 1 ? 's' : ''}
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
