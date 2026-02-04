// components/clients/DeleteModal.tsx
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Trash2, AlertCircle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  clientName: string;
  loading?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  loading = false,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      {/* Container matching your dashboard palette */}
      <div className="bg-[#0a0c14] backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-8 overflow-hidden relative">
        
        {/* Subtle red danger glow at the top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600/50 to-transparent" />

        <div className="text-center mb-8">
          {/* Replaced SVG with Lucide for consistency with your other components */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.3)] flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight">
            Supprimer le client ?
          </h3>
          
          <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
             <p className="text-slate-400 text-sm leading-relaxed">
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-bold text-rose-500">
                {clientName}
              </span>?
            </p>
            <div className="flex items-center gap-2 mt-3 justify-center text-[11px] text-amber-500/80 bg-amber-500/5 py-2 px-3 rounded-lg border border-amber-500/10">
              <AlertCircle size={14} />
              <span className="uppercase font-bold tracking-wider">Action Irréversible</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500 italic">
            Note: Cette action supprimera également toutes les polices, véhicules, devis et quittances associés.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-6 border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all rounded-xl"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-6 bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/20 transition-all rounded-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Suppression...</span>
              </div>
            ) : (
              "Supprimer"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}