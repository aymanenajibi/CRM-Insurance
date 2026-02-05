import VehiculeTable from "../../components/vehicule/VehiculesTable";
import PageMeta from "../../components/common/PageMeta";

export default function VehiculesPage() {
  return (
      <>
        <PageMeta
          title="Gestion des Véhicules | PoliSys"
          description="Page de gestion des véhicules"
        />

        <div className="p-6">
          <VehiculeTable />
        </div>
      </>
  );
}