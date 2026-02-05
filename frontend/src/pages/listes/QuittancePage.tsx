// pages/quittancesPage.tsx
import QuittanceTable from "../../components/quittance/QuittanceTable";
import PageMeta from "../../components/common/PageMeta";

export default function QuittancesPage() {
  return (
    <> 
      <PageMeta
        title="Gestion des quittances | PoliSys"
        description="Page de gestion des quittances"
      />
      
      <div className="p-6">
        <QuittanceTable />
      </div>
    </>
  );
}