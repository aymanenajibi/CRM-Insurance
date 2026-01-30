import PageMeta from "../../components/common/PageMeta";
import UsersTable from "../../components/Users/UsersTable";
import ProtectedRoute from "../../components/common/ProtectedRoute";

export default function UsersPage() {
  return (
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
  );
}