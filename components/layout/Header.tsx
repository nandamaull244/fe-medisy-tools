"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/icons";
import { getFaskes } from "@/services/faskes.service";

export default function Header() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // debounce search
  useEffect(() => {
    if (!keyword) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await getFaskes({
          name: keyword,
          size: 10,
        });

        setResults(res || []);
        setOpen(true);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [keyword]);
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <div className="w-full flex justify-center py-4 bg-background">
      <div className="w-full bg-white rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.svg" alt="" className="w-[70%]" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 relative">
          {/* Search */}
          <div className="relative w-64">
            <div className="flex items-center bg-gray-light px-3 py-2 rounded-lg">
              <input
                type="text"
                placeholder="Cari faskes"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
              />
              <Icons.search size={20} />
            </div>

            {/* Dropdown */}
            {open && results.length > 0 && (
              <div className="absolute mt-2 w-full bg-white border rounded-lg shadow z-50 max-h-60 overflow-y-auto">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      router.push(`/faskes/${item.id}`);
                      setOpen(false);
                      setKeyword("");
                    }}
                    className="px-3 py-2 text-sm hover:bg-gray-light cursor-pointer"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {open && keyword && results.length === 0 && (
            <div className="absolute mt-2 w-full bg-white border rounded-lg shadow p-3 text-sm text-gray-500">
              Tidak ditemukan
            </div>
          )}

          {/* Notification */}
          <button className="w-9 h-9 rounded-lg bg-gray-light flex items-center justify-center">
            <Icons.bell size={20} />
          </button>

          {/* Help */}
          <button className="w-9 h-9 rounded-lg bg-gray-light flex items-center justify-center">
            <Icons.help size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
