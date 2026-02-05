// pages/OtherPage/Unauthorized.tsx
import { AlertTriangle } from "lucide-react";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Accès non autorisé
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Cette section est réservée aux administrateurs.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
          >
            Retour à l'accueil
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            Retour en arrière
          </Button>
        </div>
      </div>
    </div>
  );
}
