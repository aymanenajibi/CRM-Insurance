// pages/ClientsPage.tsx
import ClientsTable from "../../components/clients/ClientsTable";

export default function ClientsPage() {
  return (

    <> 
    <ProtectedRoute requireAdmin>
      <>
        <PageMeta
          title="Gestion des utilisateurs | Admin"
          description="Page d'administration des utilisateurs"
        />
        
        <div className="p-6">
          <UsersTable />
        </div>
      </>
    </ProtectedRoute>
    </>
    <div className="container mx-auto px-4 py-8">
      <ClientsTable />
    </div>
  );
}