"use client";

import { Icons } from "@/icons";
import { useState, useMemo } from "react";
import { useEffect, useRef } from "react";

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
  const [search, setSearch] = useState("");

  const selected = options.find((o) => o.value === value);

  //filter berdasarkan search
  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-64 ">
      {/* Label */}
      {label && <p className="text-sm mb-1 text-text">{label}</p>}

      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-light rounded-lg px-3 py-2 cursor-pointer bg-white flex justify-between items-center"
      >
        <span className="text-sm">
          {selected ? selected.label : placeholder}
        </span>
        <Icons.dropdown size={16} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-light rounded-lg shadow z-10">
          <div className="p-2 border-b">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari faskes..."
              className="w-full px-2 py-1 text-sm border rounded outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <p className="p-2 text-sm text-gray-400">Tidak ditemukan</p>
            )}

            {filteredOptions.map((item) => (
              <div
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={`px-3 py-2 text-sm hover:bg-gray-light cursor-pointer flex justify-between ${
                  value === item.value ? "bg-gray-light font-medium" : ""
                }`}
              >
                {item.label}
                {value === item.value && "✓"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
