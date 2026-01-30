import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useModal } from "../hooks/useModal";
import { Modal } from "../components/ui/modal";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";

export default function UserProfiles() {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    updateProfile, 
    changePassword,
    refreshUser,
    clearError,
    getUserInitial,
    getUserColor
  } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Modals
  const editModal = useModal();
  const passwordModal = useModal();
  const avatarModal = useModal();

  // Charger les données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !user) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        
        // Mettre à jour le formulaire avec les données actuelles
        setFormData({
          username: user.username || "",
          email: user.email || "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Échec du chargement des données utilisateur");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user, navigate]);

  // Gestion de la sélection de fichier pour l'avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille du fichier doit être inférieure à 5MB");
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image");
        return;
      }

      setAvatarFile(file);
      
      // Créer un preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      clearError();

      // Validation
      if (!formData.username.trim()) {
        throw new Error("Le nom d'utilisateur est requis");
      }

      if (!formData.email.trim()) {
        throw new Error("L'email est requis");
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error("Adresse email invalide");
      }

      // Mettre à jour le profil via le hook useAuth
      await updateProfile({
        username: formData.username,
        email: formData.email,
      });

      setSuccess("Profil mis à jour avec succès !");
      editModal.closeModal();
      
        // Rafraîchir les données utilisateur depuis l'API
        await refreshUser();

    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError(err.response?.data?.detail || err.message || "Échec de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      clearError();

      // Validation
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("Les nouveaux mots de passe ne correspondent pas");
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }

      // Changer le mot de passe via le hook useAuth
      await changePassword({ new_password: passwordForm.newPassword });

      setSuccess("Mot de passe changé avec succès !");
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
      passwordModal.closeModal();

    } catch (err: any) {
      console.error("Erreur lors du changement de mot de passe:", err);
      setError(err.response?.data?.detail || err.message || "Échec du changement de mot de passe");
    } finally {
      setSaving(false);
    }
  };

  // Télécharger l'avatar
  const handleUploadAvatar = async () => {
    if (!avatarFile || !user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      clearError();

      // Pour l'instant, simulation (à implémenter avec votre API si vous avez un endpoint pour les avatars)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Avatar mis à jour avec succès !");
      setAvatarFile(null);
      avatarModal.closeModal();

    } catch (err: any) {
      console.error("Erreur lors du téléchargement de l'avatar:", err);
      setError("Échec du téléchargement de l'avatar");
    } finally {
      setSaving(false);
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Utilisateur non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Profil de ${user.username} | PoliSys`}
        description="Page de profil utilisateur"
      />

      <div className="space-y-6">
        {/* Messages d'alerte */}
        {error && (
          <div className="p-4 border border-error-200 rounded-2xl bg-error-50 dark:bg-error-500/[0.08] dark:border-error-500/30">
            <div className="flex items-start gap-3">
              <svg className="fill-error-500 dark:fill-error-400 mt-0.5" width="20" height="20" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18ZM9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6V10C11 10.5523 10.5523 11 10 11C9.44772 11 9 10.5523 9 10V6ZM9 13C9 12.4477 9.44772 12 10 12C10.5523 12 11 12.4477 11 13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13Z" />
              </svg>
              <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 border border-green-200 rounded-2xl bg-green-50 dark:bg-green-500/[0.08] dark:border-green-500/30">
            <div className="flex items-start gap-3">
              <svg className="fill-green-500 dark:fill-green-400 mt-0.5" width="20" height="20" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18ZM14.7071 8.70711C15.0976 8.31658 15.0976 7.68342 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9 11.5858L6.70711 9.29289C6.31658 8.90237 5.68342 8.90237 5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071L8.29289 13.7071C8.68342 14.0976 9.31658 14.0976 9.70711 13.7071L14.7071 8.70711Z" />
              </svg>
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          </div>
        )}

        {/* Section Avatar */}
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${getUserColor()} lg:w-32 lg:h-32`}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getUserInitial()
                )}
              </div>
              
              <button
                onClick={avatarModal.openModal}
                className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Changer la photo de profil"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Info utilisateur */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {user.username}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin" 
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}>
                  {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                </span>
                
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.active ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {user.active ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Membre depuis</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {formatDate(user.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">ID Compte</p>
                  <p className="font-medium text-gray-800 dark:text-white/90 font-mono">
                    #{user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Informations Personnelles */}
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Informations Personnelles
              </h4>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Nom d'utilisateur
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.username}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Rôle
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Statut du compte
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.active ? "✅ Actif" : "❌ Inactif"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Date de création
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={editModal.openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              disabled={saving}
            >
              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
              </svg>
              Modifier
            </button>
          </div>
        </div>

        {/* Carte Sécurité */}
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Sécurité
              </h4>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Authentification à deux facteurs
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    Non activée
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={passwordModal.openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              disabled={saving}
            >
              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 8.25H13.125V6C13.125 3.93 11.445 2.25 9.375 2.25C7.305 2.25 5.625 3.93 5.625 6V8.25H5.25C4.425 8.25 3.75 8.925 3.75 9.75V14.25C3.75 15.075 4.425 15.75 5.25 15.75H13.5C14.325 15.75 15 15.075 15 14.25V9.75C15 8.925 14.325 8.25 13.5 8.25ZM9.75 12.435V13.5C9.75 13.914 9.414 14.25 9 14.25C8.586 14.25 8.25 13.914 8.25 13.5V12.435C7.89 12.195 7.65 11.79 7.65 11.325C7.65 10.56 8.265 9.945 9.03 9.945C9.795 9.945 10.41 10.56 10.41 11.325C10.41 11.79 10.17 12.195 9.81 12.435H9.75ZM11.625 8.25H6.375V6C6.375 4.755 7.38 3.75 8.625 3.75H9.375C10.62 3.75 11.625 4.755 11.625 6V8.25Z" fill="" />
              </svg>
              Changer le mot de passe
            </button>
          </div>
        </div>

        {/* Zone Dangereuse */}
        <div className="p-5 border border-error-200 rounded-2xl dark:border-error-500/30 lg:p-6">
          <h4 className="mb-4 text-lg font-semibold text-error-600 dark:text-error-400">
            Zone Dangereuse
          </h4>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-medium text-error-800 dark:text-error-300">
                  Déconnexion
                </p>
                <p className="mt-1 text-sm text-error-600 dark:text-error-400/80">
                  Déconnectez-vous de votre compte sur cet appareil.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-error-300 text-error-600 hover:bg-error-50 dark:border-error-500 dark:text-error-400 dark:hover:bg-error-500/10"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Édition du Profil */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Modifier les informations personnelles
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour vos informations pour garder votre profil à jour.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="flex flex-col">
            <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-3">
              <div className="space-y-5">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nom d'utilisateur</Label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    disabled={saving}
                    required
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Adresse Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={saving}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={editModal.closeModal} type="button" disabled={saving}>
                Annuler
              </Button>
              <Button size="sm" type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal Changement de Mot de Passe */}
      <Modal isOpen={passwordModal.isOpen} onClose={passwordModal.closeModal} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Changer le mot de passe
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Choisissez un nouveau mot de passe sécurisé.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="flex flex-col">
            <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-3">
              <div className="space-y-5">
                <div className="col-span-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    placeholder="Entrez votre nouveau mot de passe"
                    disabled={saving}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
                </div>

                <div className="col-span-2">
                  <Label>Confirmer le nouveau mot de passe</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    placeholder="Confirmez votre nouveau mot de passe"
                    disabled={saving}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={passwordModal.closeModal} type="button" disabled={saving}>
                Annuler
              </Button>
              <Button size="sm" type="submit" disabled={saving}>
                {saving ? "Changement..." : "Changer le mot de passe"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal Avatar */}
      <Modal isOpen={avatarModal.isOpen} onClose={avatarModal.closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Changer la photo de profil
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Téléchargez une nouvelle photo de profil (max 5MB).
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold ${getUserColor()}`}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getUserInitial()
                )}
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mb-4"
              disabled={saving}
            >
              Sélectionner une image
            </Button>

            {avatarFile && (
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {avatarFile.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {(avatarFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={avatarModal.closeModal} disabled={saving}>
                Annuler
              </Button>
              <Button 
                size="sm" 
                onClick={handleUploadAvatar} 
                disabled={!avatarFile || saving}
              >
                {saving ? "Téléchargement..." : "Télécharger"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}