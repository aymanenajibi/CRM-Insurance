// components/users/StatusModal.tsx
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
  action: "activate" | "deactivate";
  loading?: boolean;
}

export function StatusModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  action,
  loading = false,
}: StatusModalProps) {
  const actionText = action === "activate" ? "activer" : "désactiver";
  const actionTitle = action === "activate" ? "Activer" : "Désactiver";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="text-center mb-6">
          <div
            className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
              action === "activate"
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-yellow-100 dark:bg-yellow-900/30"
            }`}
          >
            {action === "activate" ? (
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
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
            ) : (
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
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
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {actionTitle} l'utilisateur ?
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vous êtes sur le point de {actionText}{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {userName}
            </span>
            .
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 ${
              action === "activate"
                ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                : "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600"
            } text-white`}
          >
            {loading ? "Chargement..." : actionTitle}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
