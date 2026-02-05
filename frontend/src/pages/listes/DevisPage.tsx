import DevisTable from "../../components/devis/DevisTable";
import PageMeta from "../../components/common/PageMeta";

export default function DevisPage() {
  return (
      <>
        <PageMeta
          title="Gestion des Devis | PoliSys"
          description="Page de gestion des devis d'assurance"
        />

        <div className="p-6">
          <DevisTable />
        </div>
      </>
  );
}
