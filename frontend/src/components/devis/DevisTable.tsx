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

const FileIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const QuittanceIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function DevisTable() {
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

  useEffect(() => {
    fetchDevis();
    fetchClients();
    fetchVehicules();
    fetchPolices();
  }, []);

  // Fonction pour trouver le client correspondant à un devis
  const getClientForDevis = (devisItem: Devis) => {
    // Essayer d'abord avec la relation directe (si l'API retourne les relations)
    if (devisItem.client) {
      return devisItem.client;
    }

    // Sinon, chercher dans la liste des clients chargés
    if (devisItem.fk_client_id) {
      const foundClient = clients.find(client => client.id === devisItem.fk_client_id);
      if (foundClient) {
        return foundClient;
      }
    }

    // Si pas trouvé via fk_client_id, essayer de le déduire de la police
    if (devisItem.fk_police_id) {
      const police = polices.find(p => p.id === devisItem.fk_police_id);
      if (police && police.fk_client_id) {
        const foundClient = clients.find(client => client.id === police.fk_client_id);
        if (foundClient) {
          return foundClient;
        }
      }
    }

    return null;
  };

  const handleCreateDevis = async (formData: DevisFormData) => {
    try {
      // Envoyer directement les données du formulaire
      // Le statut est déjà inclus dans formData
      await createDevis(formData);
      devisModal.closeModal();
    } catch (error) {
      console.error("Erreur création devis:", error);
    }
  };

  const handleUpdateDevis = async (formData: DevisFormData) => {
    if (!selectedDevis) return;
    try {
      // Utiliser les données du formulaire directement
      // Le statut vient du formulaire
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
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (statut?: string): "success" | "warning" | "error" | "info" => {
    if (!statut) return 'info';

    const colors = {
      'accepte': 'success',
      'en_attente': 'warning',
      'refuse': 'error',
      'expire': 'info'
    };
    return colors[statut as keyof typeof colors] || 'info';
  };

  const getStatusLabel = (statut?: string) => {
    if (!statut) return 'En attente';

    const labels = {
      'accepte': 'Accepté',
      'en_attente': 'En attente',
      'refuse': 'Refusé',
      'expire': 'Expiré'
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  if (loading && devis.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des devis...
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
                  fetchDevis();
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
            Gestion des devis
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {devis.length} devi{devis.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          startIcon={<AddIcon />}
        >
          Nouveau devis
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Numéro devis
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Client
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Montant
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Période
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
              {devis.map((devisItem) => {
                const client = getClientForDevis(devisItem);

                return (
                  <TableRow key={devisItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              D
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {devisItem.num_devis}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {devisItem.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {client ? client.nom_complet : `Client ID: ${devisItem.fk_client_id}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client ? `CIN: ${client.cin}` : `ID: ${devisItem.fk_client_id}`}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(devisItem.prime_total)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="text-sm">
                        <div className="text-gray-700 dark:text-gray-300">
                          Du {formatDate(devisItem.date_effet)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Au {formatDate(devisItem.date_echeance)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge
                        color={getStatusColor(devisItem.statut)}
                        variant="light"
                        size="md"
                        className="font-medium"
                      >
                        {getStatusLabel(devisItem.statut)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(devisItem)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <EditIcon />
                        </Button>

                        {/* Modifier la condition pour ne plus dépendre du statut */}
                        {!devisItem.quittance && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenererQuittance(devisItem.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Générer une quittance"
                          >
                            <QuittanceIcon />
                          </Button>
                        )}

                        {devisItem.quittance && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Voir la quittance"
                            onClick={() => {
                              // TODO: Naviguer vers la quittance
                            }}
                          >
                            <FileIcon />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteModal(devisItem)}
                          className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:text-error-300"
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

        {devis.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun devis trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Commencez par créer votre premier devis
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              startIcon={<AddIcon />}
            >
              Créer un devis
            </Button>
          </div>
        )}
      </div>

      {/* Devis Form Modal */}
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
              statut: selectedDevis.statut || 'en_attente',
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

      {/* Delete Modal */}
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
