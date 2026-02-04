import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Vehicule, VehiculeCreate } from "../../types/vehicule";
import { Client } from "../../types/client";
import { Select, message, ConfigProvider, theme } from "antd";

interface VehiculeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Vehicule | null;
  clients: Client[];
  isEditing?: boolean;
  loading?: boolean;
}

const defaultFormData: VehiculeCreate = {
  matricule: "",
  marque: "",
  model: "",
  date_mise_en_circulation: "",
  valeur_venale: 0,
  puissance_fiscale: 0,
  fk_client_id: 0,
};

export function VehiculeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  clients,
  isEditing = false,
  loading = false,
}: VehiculeFormModalProps) {
  const [formData, setFormData] = useState<VehiculeCreate>(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date_mise_en_circulation: initialData.date_mise_en_circulation
          ? initialData.date_mise_en_circulation.split("T")[0]
          : "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);

      // SUCCESS MESSAGE (TOAST)
      // We set a massive zIndex here to ensure it beats your Navigation bar
      message.success({
        content: isEditing
          ? "Véhicule mis à jour !"
          : "Véhicule créé avec succès !",
        duration: 3,
        style: {
          marginTop: "10vh",
          zIndex: 99999,
        },
      });
      onClose();
    } catch (error) {
      message.error("Erreur lors de l'enregistrement");
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-2xl"
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Modifier le véhicule" : "Nouveau véhicule"}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Matricule *
                </Label>
                <Input
                  value={formData.matricule}
                  onChange={(e) =>
                    setFormData({ ...formData, matricule: e.target.value })
                  }
                  placeholder="12345-A-15"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Mise en circulation *
                </Label>
                <Input
                  type="date"
                  value={formData.date_mise_en_circulation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date_mise_en_circulation: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Marque */}
              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Marque *
                </Label>
                <Input
                  value={formData.marque}
                  onChange={(e) =>
                    setFormData({ ...formData, marque: e.target.value })
                  }
                  placeholder="Toyota"
                  required
                />
              </div>

              {/* Modèle */}
              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Modèle *
                </Label>
                <Input
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="Yaris"
                  required
                />
              </div>

              {/* Valeur Vénale */}
              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Valeur vénale
                </Label>
                <Input
                  type="number"
                  value={formData.valeur_venale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valeur_venale: parseFloat(e.target.value),
                    })
                  }
                  placeholder="0.00"
                />
              </div>

              {/* Puissance */}
              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Puissance fiscale
                </Label>
                <Input
                  type="number"
                  value={formData.puissance_fiscale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      puissance_fiscale: parseInt(e.target.value),
                    })
                  }
                  placeholder="8"
                />
              </div>
            </div>

            {/* SEARCHABLE DROPDOWN (PROPRIÉTAIRE) */}
            <div className="flex flex-col">
              <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Propriétaire *
              </Label>
              <Select
                showSearch
                placeholder="Tapez pour rechercher un client..."
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="w-full custom-antd-select"
                value={formData.fk_client_id || undefined}
                onChange={(value) =>
                  setFormData({ ...formData, fk_client_id: value })
                }
                getPopupContainer={(trigger) => trigger.parentElement}
                options={(clients || []).map((client) => ({
                  value: client.id,
                  label: `${client.nom_complet} (${client.cin})`,
                }))}
                style={{
                  height: "46px",
                  width: "100%",
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
              >
                {loading
                  ? "Chargement..."
                  : isEditing
                    ? "Enregistrer"
                    : "Créer"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
