// pages/ClientsPage.tsx
import ClientsTable from "../../components/clients/ClientsTable";
import PageMeta from "../../components/common/PageMeta";

export default function ClientsPage() {
  return (

    <> 
      <>
        <PageMeta
          title="Gestion des Clients | PoliSys"
          description="Page de gestion des clients"
        />
        
        <div className="p-6">
          <ClientsTable />
        </div>
      </>
    </>
  );
}