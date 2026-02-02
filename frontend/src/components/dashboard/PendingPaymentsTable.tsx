import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PendingPayment } from "../../types/stats";
import { User, Receipt, CreditCard, ChevronRight, AlertCircle } from "lucide-react";
import Badge from "../ui/badge/Badge";

interface PendingPaymentsTableProps {
  payments: PendingPayment[];
}

export function PendingPaymentsTable({ payments }: PendingPaymentsTableProps) {
  return (
    <Card className="col-span-12 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800/50 shadow-2xl">
      <CardHeader className="pb-8 border-b border-slate-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#5B8DEF]/10 rounded-lg border border-[#5B8DEF]/20">
                <Receipt className="w-5 h-5 text-[#5B8DEF]" />
              </div>
              <CardTitle className="text-2xl font-bold text-white tracking-tight">
                Suivi des Encaissements
              </CardTitle>
            </div>
            <CardDescription className="text-slate-400 text-sm ml-12">
              Quittances validées avec solde débiteur
            </CardDescription>
          </div>
          
          {payments.length > 0 && (
            <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-4 py-2 font-semibold whitespace-nowrap">
              {payments.length} {payments.length === 1 ? 'Dossier' : 'Dossiers'} à régulariser
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-800/50 hover:bg-transparent">
                <TableHead className="h-12 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  Client
                </TableHead>
                <TableHead className="h-12 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  Paiement
                </TableHead>
                <TableHead className="h-12 px-6 text-right text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  Montant Total
                </TableHead>
                <TableHead className="h-12 px-6 text-right text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  Reste à Payer
                </TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <TableRow 
                    key={payment.id} 
                    className="border-b border-slate-800/30 hover:bg-[#5B8DEF]/5 transition-all duration-200 group cursor-pointer"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 group-hover:bg-[#5B8DEF]/10 group-hover:border-[#5B8DEF]/30 group-hover:text-[#5B8DEF] transition-all duration-200">
                          <User size={16} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-white text-sm group-hover:text-[#5B8DEF] transition-colors">
                            {payment.client_name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            REF-{payment.id.toString().padStart(6, '0')}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-800/50 rounded-md border border-slate-700/50">
                          <CreditCard size={14} className="text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-300">
                          {payment.mode_paiement || "Non spécifié"}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-slate-300 tabular-nums">
                        {payment.prime_total.toLocaleString('fr-FR')} DH
                      </span>
                    </TableCell>
                    
                    <TableCell className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <AlertCircle size={14} className="text-rose-400" />
                        <span className="text-sm font-bold text-rose-400 tabular-nums">
                          {payment.solde.toLocaleString('fr-FR')} DH
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-4 text-right">
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[#5B8DEF]/10 rounded-lg transition-all duration-200 text-slate-400 hover:text-[#5B8DEF]"
                        aria-label="Voir détails"
                      >
                        <ChevronRight size={18} strokeWidth={2} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                        <Receipt size={40} className="text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-medium text-slate-400">
                          Aucun impayé détecté
                        </p>
                        <p className="text-sm text-slate-500">
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
          <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-900/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Total des impayés
              </span>
              <span className="font-bold text-rose-400 tabular-nums">
                {payments.reduce((acc, p) => acc + p.solde, 0).toLocaleString('fr-FR')} DH
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}