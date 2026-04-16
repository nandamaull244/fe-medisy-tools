type SwitchProps = {
  label?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function Switch({
  label,
  checked,
  onChange,
}: SwitchProps) {
  return (
    <div className="flex items-center justify-between w-full">
      
      {/* Label */}
      {label && (
        <span className="text-sm text-text font-medium">
          {label}
        </span>
      )}

      {/* Switch */}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition 
          ${checked ? "bg-primary" : "bg-gray-light"}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform transition 
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>

    </div>
  );
}