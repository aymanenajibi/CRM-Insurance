// components/users/StatusModal.tsx
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
  action: "activate" | "deactivate";
  loading?: boolean;
}

export function StatusModal({ isOpen, onClose, onConfirm, userName, action, loading = false }: StatusModalProps) {
  const actionText = action === "activate" ? "activer" : "désactiver";
  const actionTitle = action === "activate" ? "Activer" : "Désactiver";

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdropBlur={true} className="max-w-md">
      <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border ${action === "activate" ? "border-green-200/50 dark:border-green-900/50" : "border-yellow-200/50 dark:border-yellow-900/50"} shadow-2xl p-8`}>
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${action === "activate" ? "bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20" : "bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/20"} flex items-center justify-center`}>
            <div className={`w-16 h-16 rounded-2xl ${action === "activate" ? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" : "bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700"} flex items-center justify-center`}>
              {action === "activate" ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {actionTitle} l'utilisateur ?
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir {actionText}{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {userName}
            </span>
            ?
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 ${action === "activate" ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" : "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"}`}
          >
            {loading ? "Chargement..." : actionTitle}
          </Button>
        </div>
      </div>
    </Modal>
  );
}