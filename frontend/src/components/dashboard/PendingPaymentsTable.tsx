// components/stats/PendingPaymentsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PendingPayment } from "../../types/stats";
import { User, CreditCard, ChevronRight, AlertCircle } from "lucide-react";

interface PendingPaymentsTableProps {
  payments: PendingPayment[];
}

export function PendingPaymentsTable({ payments }: PendingPaymentsTableProps) {
  const totalPending = payments.reduce((acc, p) => acc + p.solde, 0);

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Suivi des encaissements
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Quittances validées avec solde débiteur
          </p>
        </div>

        <Badge
          color={payments.length > 0 ? "error" : "success"}
          variant="light"
          size="sm"
        >
          {payments.length} {payments.length === 1 ? "dossier" : "dossiers"}
        </Badge>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-left">
                  Client
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-left">
                  Paiement
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-right">
                  Montant total
                </TableCell>
                <TableCell className="py-3 px-6 font-medium text-gray-700 dark:text-gray-300 text-right">
                  Reste à payer
                </TableCell>
                <TableCell className="w-[40px]"></TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User
                            size={16}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {payment.client_name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            REF-{payment.id.toString().padStart(6, "0")}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded">
                          <CreditCard
                            size={14}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {payment.mode_paiement || "Non spécifié"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-6 text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {payment.prime_total.toLocaleString("fr-FR")} DH
                      </span>
                    </TableCell>

                    <TableCell className="py-3 px-6 text-right">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded">
                        <AlertCircle
                          size={12}
                          className="text-red-600 dark:text-red-400"
                        />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          {payment.solde.toLocaleString("fr-FR")} DH
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-6">
                      <button
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        aria-label="Voir détails"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <CreditCard
                          size={24}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-medium text-gray-600 dark:text-gray-400">
                          Aucun impayé détecté
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Tous les paiements sont à jour
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {payments.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total des impayés
              </span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {totalPending.toLocaleString("fr-FR")} DH
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
