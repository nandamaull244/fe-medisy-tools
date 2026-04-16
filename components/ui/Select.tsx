"use client";

import { Icons } from "@/icons";
import { Span } from "next/dist/trace";
import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Pilih...",
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-64">
      
      {/* Label */}
      {label && (
        <p className="text-sm mb-1 text-text">{label}</p>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-light rounded-lg px-3 py-2 cursor-pointer bg-white flex justify-between items-center"
      >
        <span className="text-sm">
          {selected ? selected.label : placeholder}
        </span>
        <span><Icons.dropdown size={16} /></span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-light rounded-lg shadow z-10">
          {options.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm hover:bg-gray-light cursor-pointer ${
                value === item.value && <span>✓</span> ? "bg-gray-light font-medium" : ""
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}