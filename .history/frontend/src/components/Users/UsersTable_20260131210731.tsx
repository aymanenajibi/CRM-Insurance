// components/users/UsersTable.tsx
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { UserFormModal } from "./UserFormModal";
import { DeleteModal } from "./DeleteModal";
import { StatusModal } from "./StatusModal";
import { useUserStore } from "../../stores/userStore";
import { UserFormData } from "../../types/user";

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

const DeactivateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const ActivateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function UsersTable() {
  const {
    users,
    loading,
    error,
    selectedUser,
    fetchUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    setSelectedUser,
    clearError,
  } = useUserStore();

  const userModal = useModal();
  const deleteModal = useModal();
  const statusModal = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [statusAction, setStatusAction] = useState<"activate" | "deactivate">("activate");

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (formData: UserFormData) => {
    try {
      await createUser(formData);
      userModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleUpdateUser = async (formData: UserFormData) => {
    if (!selectedUser) return;
    try {
      // Ne pas envoyer le mot de passe lors de l'édition
      const { password, ...updateData } = formData;
      await updateUser(selectedUser.id, updateData);
      userModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      deleteModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    try {
      await updateUserStatus(selectedUser.id, statusAction === "activate");
      statusModal.closeModal();
    } catch (error) {
      // L'erreur est gérée par le store
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    userModal.openModal();
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    userModal.openModal();
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    deleteModal.openModal();
  };

  const openStatusModal = (user: User, action: "activate" | "deactivate") => {
    setSelectedUser(user);
    setStatusAction(action);
    statusModal.openModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitial = (username: string) => {
    return username?.charAt(0).toUpperCase() || "U";
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-yellow-500 to-yellow-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-red-500 to-red-600",
      "bg-gradient-to-br from-teal-500 to-teal-600",
    ];
    const index = username?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des utilisateurs...
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
                onClick={() => { clearError(); fetchUsers(); }}
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
            Gestion des utilisateurs
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {users.length} utilisateur{users.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          startIcon={<AddIcon />}
        >
          Nouvel utilisateur
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Utilisateur
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Rôle
                </TableCell>
                <TableCell isHeader className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                  Statut
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
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${getAvatarColor(user.username)}`}>
                        {getInitial(user.username)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      color={user.role === "admin" ? "purple" : "blue"}
                      className="font-medium"
                    >
                      {user.role === "admin" ? "Admin" : "Utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      color={user.active ? "success" : "error"}
                      className="font-medium"
                    >
                      {user.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(user)}
                        title="Modifier"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <EditIcon />
                      </Button>
                      
                      {user.active ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openStatusModal(user, "deactivate")}
                          title="Désactiver"
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          <DeactivateIcon />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openStatusModal(user, "activate")}
                          title="Activer"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <ActivateIcon />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteModal(user)}
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

      {/* User Form Modal */}
      <UserFormModal
        isOpen={userModal.isOpen}
        onClose={userModal.closeModal}
        onSubmit={isEditing ? handleUpdateUser : handleCreateUser}
        initialData={selectedUser ? {
          username: selectedUser.username,
          email: selectedUser.email,
          password: "", // Mot de passe vide pour l'édition
          role: selectedUser.role,
        } : undefined}
        isEditing={isEditing}
        loading={loading}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.username || ""}
        loading={loading}
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.closeModal}
        onConfirm={handleToggleStatus}
        userName={selectedUser?.username || ""}
        action={statusAction}
        loading={loading}
      />
    </div>
  );
}