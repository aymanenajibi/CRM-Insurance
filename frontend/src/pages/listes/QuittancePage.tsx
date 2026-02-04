import QuittanceTable from "../../components/quittance/QuittanceTable";
import PageMeta from "../../components/common/PageMeta";
import ProtectedRoute from "../../components/common/ProtectedRoute";

export default function QuittancePage() {
  return (
    <ProtectedRoute requireAdmin>
      <>
        <PageMeta
          title="Gestion des Quittances | PoliSys"
          description="Page de gestion des quittances d'assurance"
        />

        <div className="p-6">
          <QuittanceTable />
        </div>
      </>
    </ProtectedRoute>
  );
}
