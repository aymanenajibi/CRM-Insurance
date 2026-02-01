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
import { VehiculeFormModal } from "./VehiculeFormModal";
import { DeleteModal } from "./DeleteModal";
import { useVehiculeStore } from "../../store/vehiculeStore";
import { useClientStore } from "../../store/clientStore";
import { Vehicule } from "../../types/vehicule";

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

export default function VehiculeTable() {
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

  const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchVehicules();
    fetchClients();
  }, []);

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

  if (loading && vehicules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des véhicules</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {vehicules.length} véhicule{vehicules.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          startIcon={<AddIcon />}
        >
          Nouveau véhicule
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="py-4 px-6">Matricule</TableCell>
                <TableCell isHeader className="py-4 px-6">Marque/Modèle</TableCell>
                <TableCell isHeader className="py-4 px-6">Propriétaire</TableCell>
                <TableCell isHeader className="py-4 px-6">Mise en circulation</TableCell>
                <TableCell isHeader className="py-4 px-6 text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {vehicules.map((v) => (
                <TableRow key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <TableCell className="py-4 px-6 font-medium text-blue-600">{v.matricule}</TableCell>
                  <TableCell className="py-4 px-6 text-gray-900 dark:text-white uppercase text-xs font-bold">
                    {v.marque} {v.model}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge color="info" variant="light" size="md">
                      {v.client?.nom_complet || "Non assigné"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600">{v.date_mise_en_circulation}</TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(v)} className="text-blue-600 hover:bg-blue-50">
                        <EditIcon />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openDeleteModal(v)} className="text-error-600 hover:bg-error-50">
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