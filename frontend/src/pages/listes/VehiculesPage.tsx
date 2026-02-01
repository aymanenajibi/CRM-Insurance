import VehiculeTable from "../../components/vehicule/VehiculesTable";
import PageMeta from "../../components/common/PageMeta";
import ProtectedRoute from "../../components/common/ProtectedRoute";

export default function VehiculesPage() {
  return (
    <ProtectedRoute requireAdmin>
      <>
        <PageMeta
          title="Gestion des Véhicules | PoliSys"
          description="Page de gestion des véhicules"
        />

        <div className="p-6">
          <VehiculeTable />
        </div>
      </>
    </ProtectedRoute>
  );
}