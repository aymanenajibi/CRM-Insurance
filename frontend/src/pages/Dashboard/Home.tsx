import React, { useEffect, useState } from "react";
import { statsService } from "../../services/statsService";
import { DashboardStatsResponse } from "@/types/stats";
import { StatCards } from "../../components/dashboard/StatCards";
import { BrandDonutChart } from "../../components/dashboard/BrandDonutChart";
import { RevenueBarChart } from "@/components/dashboard/RevenueBarChart";
import { PendingPaymentsTable } from "@/components/dashboard/PendingPaymentsTable";


export default function Home() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await statsService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Impossible de charger les statistiques.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-20">
        <div className="text-muted-foreground animate-pulse font-medium">
          Chargement du tableau de bord...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
        {error || "Une erreur est survenue."}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8  min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Aperçu en temps réel de votre activité d'assurance.
        </p>
      </div>

      <StatCards cards={stats.cards} />

      <div className="grid gap-6 md:grid-cols-7 items-stretch">
        <div className="md:col-span-4 h-full">
          <RevenueBarChart data={stats.main_chart} />
        </div>
        <div className="md:col-span-3 h-full">
          <BrandDonutChart data={stats.distribution_chart} />
        </div>
      </div>
      <div className="mt-6">
        <PendingPaymentsTable payments={stats.pending_payments} />
      </div>
    </div>
  );
}
