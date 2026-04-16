type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  error?: string;
};

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
    error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      
      {/* Label */}
      {label && (
        <label className="text-sm text-text font-medium">
          {label}
        </label>
      )}

      {/* Input */}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}


    </div>
  );
}