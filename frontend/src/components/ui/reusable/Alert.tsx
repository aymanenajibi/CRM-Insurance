import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "destructive" | "success" | "warning";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  variant = "default",
  title,
  message,
  onClose,
  className,
}: AlertProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "destructive":
        return "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive";
      case "success":
        return "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600";
      case "warning":
        return "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600";
      default:
        return "";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        getVariantClasses(),
        className,
      )}
      role="alert"
    >
      {getIcon()}
      {title && (
        <h5 className="mb-1 font-medium leading-none tracking-tight">
          {title}
        </h5>
      )}
      <div className="text-sm [&_p]:leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <span className="sr-only">Fermer</span>
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
