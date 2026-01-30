import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Input from "../form/input/FileInput";
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import api from "../../lib/api";
import { User } from "../../types/auth";

interface FormData {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

interface EditFormData {
  username: string;
  email: string;
  role: "user" | "admin";
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const statusModal = useModal();

  // Form states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editFormData, setEditFormData] = useState<EditFormData>({
    username: "",
    email: "",
    role: "user",
  });
  const [statusAction, setStatusAction] = useState<"activate" | "deactivate">(
    "activate",
  );

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<User[]>("/users/");
      setUsers(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Erreur lors du chargement des utilisateurs",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Créer un utilisateur
  const handleCreateUser = async () => {
    try {
      const response = await api.post("/users/", formData);

      setUsers((prev) => [...prev, response.data]);
      createModal.closeModal();
      resetFormData();
      alert("Utilisateur créé avec succès !");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erreur lors de la création");
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.put(`/users/${selectedUser.id}`, editFormData);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? response.data : user,
        ),
      );
      editModal.closeModal();
      setSelectedUser(null);
      alert("Utilisateur mis à jour avec succès !");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erreur lors de la mise à jour");
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/users/${selectedUser.id}`);

      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      deleteModal.closeModal();
      setSelectedUser(null);
      alert("Utilisateur supprimé avec succès !");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erreur lors de la suppression");
    }
  };

  // Activer/Désactiver un utilisateur
  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.put(`/users/${selectedUser.id}`, {
        active: statusAction === "activate",
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? response.data : user,
        ),
      );
      statusModal.closeModal();
      setSelectedUser(null);
      alert(
        `Utilisateur ${statusAction === "activate" ? "activé" : "désactivé"} avec succès !`,
      );
    } catch (err: any) {
      alert(
        err.response?.data?.detail || "Erreur lors du changement de statut",
      );
    }
  };

  const resetFormData = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const resetEditFormData = () => {
    setEditFormData({
      username: "",
      email: "",
      role: "user",
    });
  };

  // Ouvrir le modal d'édition
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    editModal.openModal();
  };

  // Ouvrir le modal de suppression
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    deleteModal.openModal();
  };

  // Ouvrir le modal de statut
  const openStatusModal = (user: User, action: "activate" | "deactivate") => {
    setSelectedUser(user);
    setStatusAction(action);
    statusModal.openModal();
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Obtenir l'initiale pour l'avatar
  const getInitial = (username: string) => {
    return username?.charAt(0).toUpperCase() || "U";
  };

  // Obtenir la couleur de l'avatar
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Chargement des utilisateurs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-error-200 rounded-lg bg-error-50 dark:border-error-500/30 dark:bg-error-500/[0.08]">
        <div className="flex items-center gap-3">
          <svg
            className="fill-error-500 dark:fill-error-400 mt-0.5"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18ZM9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6V10C11 10.5523 10.5523 11 10 11C9.44772 11 9 10.5523 9 10V6ZM9 13C9 12.4477 9.44772 12 10 12C10.5523 12 11 12.4477 11 13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13Z"
            />
          </svg>
          <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Gestion des utilisateurs
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {users.length} utilisateur{users.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          size="sm"
          onClick={createModal.openModal}
          startIcon={
            <svg
              className="w-4 h-4"
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
          }
        >
          Nouvel utilisateur
        </Button>
      </div>

      {/* Table des utilisateurs */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Utilisateur
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Rôle
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Statut
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date d'inscription
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ${getAvatarColor(user.username)}`}
                      >
                        {getInitial(user.username)}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.username}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={user.role === "admin" ? "purple" : "blue"}
                    >
                      {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={user.active ? "success" : "error"}>
                      {user.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => openEditModal(user)}
                        title="Modifier"
                        className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Button>

                      {user.active ? (
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-yellow-400/50 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-500/50 dark:text-yellow-400 dark:hover:bg-yellow-500/10"
                          onClick={() => openStatusModal(user, "deactivate")}
                          title="Désactiver"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-green-400/50 text-green-600 hover:bg-green-50 dark:border-green-500/50 dark:text-green-400 dark:hover:bg-green-500/10"
                          onClick={() => openStatusModal(user, "activate")}
                          title="Activer"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </Button>
                      )}

                      <Button
                        size="xs"
                        variant="outline"
                        className="border-error-400/50 text-error-600 hover:bg-error-50 dark:border-error-500/50 dark:text-error-400 dark:hover:bg-error-500/10"
                        onClick={() => openDeleteModal(user)}
                        title="Supprimer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de création d'utilisateur */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        className="max-w-lg"
        backdropBlur={true}
      >
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl p-8">
          {/* Icone décorative */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nouvel utilisateur
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Remplissez les informations pour créer un nouvel utilisateur
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-white/10">
              <Button
                variant="outline"
                onClick={createModal.closeModal}
                className="px-6 py-2.5 border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateUser}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25"
              >
                Créer l'utilisateur
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de modification d'utilisateur */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-lg"
        backdropBlur={true}
      >
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl p-8">
          {/* Icone décorative */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
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
              </div>
            </div>
          </div>

          <div className="pt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Modifier l'utilisateur
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Modifier les informations de{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {selectedUser?.username}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-white/10">
              <Button
                variant="outline"
                onClick={editModal.closeModal}
                className="px-6 py-2.5 border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdateUser}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/25"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de suppression d'utilisateur */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-md"
        backdropBlur={true}
      >
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-error-200/50 dark:border-error-500/20 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-error-500/10 to-error-600/10 dark:from-error-500/20 dark:to-error-600/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-error-500 to-error-600 dark:from-error-600 dark:to-error-700 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
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
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Supprimer l'utilisateur ?
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedUser?.username}
              </span>
              ? Cette action est irréversible.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={deleteModal.closeModal}
              className="flex-1 py-2.5 border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteUser}
              className="flex-1 py-2.5 bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 shadow-lg shadow-error-500/25"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal d'activation/désactivation */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={statusModal.closeModal}
        className="max-w-md"
        backdropBlur={true}
      >
        <div
          className={`relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl border ${statusAction === "activate" ? "border-green-200/50 dark:border-green-500/20" : "border-yellow-200/50 dark:border-yellow-500/20"} shadow-2xl p-8`}
        >
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full ${statusAction === "activate" ? "bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20" : "bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/20"} flex items-center justify-center`}
            >
              <div
                className={`w-16 h-16 rounded-full ${statusAction === "activate" ? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" : "bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700"} flex items-center justify-center`}
              >
                {statusAction === "activate" ? (
                  <svg
                    className="w-8 h-8 text-white"
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
                ) : (
                  <svg
                    className="w-8 h-8 text-white"
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
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {statusAction === "activate" ? "Activer" : "Désactiver"}{" "}
              l'utilisateur ?
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir{" "}
              {statusAction === "activate" ? "activer" : "désactiver"}{" "}
              l'utilisateur{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedUser?.username}
              </span>
              ?
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={statusModal.closeModal}
              className="flex-1 py-2.5 border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
            >
              Annuler
            </Button>
            <Button
              onClick={handleToggleStatus}
              className={`flex-1 py-2.5 ${statusAction === "activate" ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25" : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/25"}`}
            >
              {statusAction === "activate" ? "Activer" : "Désactiver"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
