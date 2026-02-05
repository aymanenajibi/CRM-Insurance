import PoliceTable from "../../components/police/PoliceTable";
import PageMeta from "../../components/common/PageMeta";

export default function PolicePage() {
  return (
      <>
        <PageMeta
          title="Gestion des Polices | PoliSys"
          description="Page de gestion des polices d'assurance"
        />

        <div className="p-6">
          <PoliceTable />
        </div>
      </>
  );
}
