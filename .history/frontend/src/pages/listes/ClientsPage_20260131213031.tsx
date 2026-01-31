// pages/ClientsPage.tsx
import ClientsTable from "../../components/clients/ClientsTable";
import PageMeta from "../../components/common/PageMeta";
import ProtectedRoute from "../../components/common/ProtectedRoute";

export default function ClientsPage() {
  return (

    <> 
    <ProtectedRoute requireAdmin>
      <>
        <PageMeta
          title="Gestion des Clients | Admin"
          description="Page  des clients"
        />
        
        <div className="p-6">
          <ClientsTable />
        </div>
      </>
    </ProtectedRoute>
    </>
  );
}