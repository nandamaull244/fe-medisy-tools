type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "success" | "secondary" | "danger" | "purple";
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: React.ReactNode;
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  icon,
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-4 h-8 rounded-lg text-sm font-medium transition";

  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    success: "bg-green-500 text-white hover:opacity-90",
    secondary: "bg-gray-light text-text hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:opacity-90",
    purple: "bg-purple-500 text-white hover:opacity-90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  );
}