import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "checkbox";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  validation?: (value: any) => string | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: Field[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  submitText?: string;
  cancelText?: string;
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  errors?: Record<string, string>;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  fields,
  initialData,
  onSubmit,
  submitText = "Enregistrer",
  cancelText = "Annuler",
  size = "md",
  loading = false,
  errors = {},
}: ModalProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaultData: Record<string, any> = {};
      fields.forEach((field) => {
        defaultData[field.name] = field.defaultValue || "";
      });
      setFormData(defaultData);
    }
    setValidationErrors({});
  }, [initialData, fields]);

  const validateField = (name: string, value: any): string | null => {
    const field = fields.find((f) => f.name === name);
    if (field?.validation) {
      return field.validation(value);
    }
    if (field?.required && (!value || value.toString().trim() === "")) {
      return "Ce champ est requis";
    }
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        errors[field.name] = error;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Les erreurs sont gérées par le parent
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      default:
        return "max-w-md";
    }
  };

  const renderField = (field: Field) => {
    const error = validationErrors[field.name] || errors[field.name];
    const fieldValue = formData[field.name] || "";

    const commonProps = {
      id: field.name,
      className: cn(
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive",
      ),
      value: fieldValue,
      onChange: (e: React.ChangeEvent<any>) =>
        handleChange(field.name, e.target.value),
      required: field.required,
      disabled: field.disabled || loading,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "select":
        return (
          <select {...commonProps}>
            <option value="">Sélectionner...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return <textarea {...commonProps} rows={4} />;
      case "checkbox":
        return (
          <input
            type="checkbox"
            {...commonProps}
            checked={fieldValue}
            onChange={(e) => handleChange(field.name, e.target.checked)}
            className="h-4 w-4"
          />
        );
      case "date":
        return <input type="date" {...commonProps} />;
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[425px]", getSizeClass())}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
                {(validationErrors[field.name] || errors[field.name]) && (
                  <p className="text-sm text-destructive">
                    {validationErrors[field.name] || errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
