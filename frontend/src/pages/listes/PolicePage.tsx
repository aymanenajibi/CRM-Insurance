import PoliceTable from "../../components/police/PoliceTable";
import PageMeta from "../../components/common/PageMeta";
import ProtectedRoute from "../../components/common/ProtectedRoute";

export default function PolicePage() {
  return (
    <ProtectedRoute requireAdmin>
      <>
        <PageMeta
          title="Gestion des Polices | PoliSys"
          description="Page de gestion des polices d'assurance"
        />

        <div className="p-6">
          <PoliceTable />
        </div>
      </>
    </ProtectedRoute>
  );
}
