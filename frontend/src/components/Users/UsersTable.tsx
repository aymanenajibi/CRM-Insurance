// components/users/UsersTable.tsx
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
import { UserFormModal } from "./UserFormModal";
import { DeleteModal } from "./DeleteModal";
import { StatusModal } from "./StatusModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { useUserStore } from "../../store/userStore";
import { UserFormData, User } from "../../types/user";

// Icons
const AddIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeactivateIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
    />
  </svg>
);

const ActivateIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const ResetPasswordIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
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
    resetPassword,
    setSelectedUser,
    clearError,
  } = useUserStore();

  const userModal = useModal();
  const deleteModal = useModal();
  const statusModal = useModal();
  const resetPasswordModal = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusAction, setStatusAction] = useState<"activate" | "deactivate">(
    "activate",
  );

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

  const handleResetPassword = async (newPassword: string) => {
    if (!selectedUser) return;
    try {
      await resetPassword(selectedUser.id, newPassword);
      resetPasswordModal.closeModal();
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

  const openResetPasswordModal = (user: User) => {
    setSelectedUser(user);
    resetPasswordModal.openModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Administrateur" : "Utilisateur";
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "primary" : "info";
  };

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des utilisateurs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-lg mx-auto">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5"
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
            <p className="mt-1 text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchUsers();
              }}
              className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec recherche et bouton */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Utilisateurs
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {filteredUsers.length} utilisateur
            {filteredUsers.length > 1 ? "s" : ""} trouvé
            {filteredUsers.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            startIcon={<AddIcon />}
          >
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-left">
                  Utilisateur
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-left">
                  Email
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-left">
                  Rôle
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-left">
                  Statut
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-left">
                  Inscription
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <UserIcon />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-6 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3 px-6">
                    <Badge
                      color={getRoleColor(user.role)}
                      variant="light"
                      size="sm"
                    >
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-6">
                    <Badge
                      color={user.active ? "success" : "error"}
                      variant="light"
                      size="sm"
                    >
                      {user.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-6 text-gray-600 dark:text-gray-400 text-sm">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Modifier"
                      >
                        <EditIcon />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openResetPasswordModal(user)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        title="Réinitialiser le mot de passe"
                      >
                        <ResetPasswordIcon />
                      </Button>

                      {user.active ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openStatusModal(user, "deactivate")}
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          title="Désactiver"
                        >
                          <DeactivateIcon />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openStatusModal(user, "activate")}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                          title="Activer"
                        >
                          <ActivateIcon />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Supprimer"
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

      {/* Modal Utilisateur */}
      <UserFormModal
        isOpen={userModal.isOpen}
        onClose={userModal.closeModal}
        onSubmit={isEditing ? handleUpdateUser : handleCreateUser}
        initialData={
          selectedUser
            ? {
                username: selectedUser.username,
                email: selectedUser.email,
                password: "",
                role: selectedUser.role,
              }
            : undefined
        }
        isEditing={isEditing}
        loading={loading}
      />

      {/* Modal Suppression */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.username || ""}
        loading={loading}
      />

      {/* Modal Statut */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.closeModal}
        onConfirm={handleToggleStatus}
        userName={selectedUser?.username || ""}
        action={statusAction}
        loading={loading}
      />

      {/* Modal Réinitialisation Mot de Passe */}
      <ResetPasswordModal
        isOpen={resetPasswordModal.isOpen}
        onClose={resetPasswordModal.closeModal}
        onConfirm={handleResetPassword}
        userName={selectedUser?.username || ""}
        loading={loading}
      />
    </div>
  );
}
