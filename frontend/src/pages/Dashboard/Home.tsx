import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title=" statistiques | PoliSys"
        description="Page d'accueil du CRM PoliSys"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 lg:text-3xl">
            Bienvenu sur PoliSys Dashboard
          </h1>
        </div>
      </div>
    </>
  );
}
