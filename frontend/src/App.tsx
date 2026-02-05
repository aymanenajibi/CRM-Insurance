import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UsersPage from "./pages/listes/UsersPage";
import ClientsPage from "./pages/listes/ClientsPage";
import PolicePage from "./pages/listes/PolicePage";
import VehiculesPage from "./pages/listes/VehiculesPage";
import DevisPage from "./pages/listes/DevisPage";
import Unauthorized from "./pages/OtherPage/Unauthorized"; // Vous devez créer cette page
import QuittancesPage from "./pages/listes/QuittancePage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout - Routes protégées */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />

            {/* Route /users accessible uniquement par les admins */}
            <Route
              path="/users"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            {/* Autres routes accessibles à tous les utilisateurs authentifiés */}
            <Route path="/client" element={<ClientsPage />} />
            <Route path="/police" element={<PolicePage />} />
            <Route path="/vehicules" element={<VehiculesPage />} />
            <Route path="/devis" element={<DevisPage />} />
            <Route path="/quittances" element={<QuittancesPage />} />
          </Route>

          {/* Auth Layout - Routes publiques */}
          <Route path="/signin" element={<SignIn />} />

          {/* Route pour non autorisé */}
          <Route path="/non-autorise" element={<Unauthorized />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
