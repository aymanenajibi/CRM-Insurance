import { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void; // Click handler avec event
  type?: "button" | "submit" | "reset"; // Button type
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
  loading?: boolean; // Loading state
  form?: string; // Form attribute
  name?: string; // Name attribute
  value?: string; // Value attribute
  autoFocus?: boolean; // Auto focus
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  type = "button", // Par défaut "button" pour éviter les soumissions non désirées
  className = "",
  disabled = false,
  loading = false,
  form,
  name,
  value,
  autoFocus,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  // Gestionnaire de clic amélioré
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  // Rendu du contenu du bouton
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="inline-flex items-center">
            {/* Spinner pour l'état de chargement */}
            <svg
              className="w-4 h-4 mr-2 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span className="opacity-80">Loading...</span>
        </>
      );
    }

    return (
      <>
        {startIcon && <span className="flex items-center">{startIcon}</span>}
        {children}
        {endIcon && <span className="flex items-center">{endIcon}</span>}
      </>
    );
  };

  // Classes conditionnelles
  const buttonClasses = `
    inline-flex items-center justify-center gap-2 rounded-lg transition
    ${className}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
    ${loading ? "relative" : ""}
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500
    active:scale-95 transition-transform duration-100
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      form={form}
      name={name}
      value={value}
      autoFocus={autoFocus}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {renderContent()}
    </button>
  );
};

export default Button;