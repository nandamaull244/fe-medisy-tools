"use client";

import { useEffect, useState } from "react";
import { getFaskes } from "@/services/faskes.service";
import { updateVersion } from "@/services/migration.service";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function VersionPage() {
  const [options, setOptions] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [version, setVersion] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    getFaskes({ size: 100 }).then(setOptions);
  }, []);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleUpdate = async () => {
    if (!version) {
      setAlert({
        message: "Version wajib diisi",
        type: "error",
      });
      return;
    }

    if (selected.length === 0) {
      setAlert({
        message: "Pilih minimal 1 faskes",
        type: "error",
      });
      return;
    }

    if (loading) return;

    setLoading(true);
    setAlert(null);

    try {
      const res = await updateVersion({
        include_ids: selected,
        target: version,
      });

      setAlert({
        message: res?.message || "Berhasil update version",
        type: "success",
      });

      // reset (optional)
      setSelected([]);
      setVersion("");
    } catch (err: any) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err.response?.data);

      setAlert({
        message: err?.response?.data?.message || "Gagal update version",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!alert) return;

    const t = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(t);
  }, [alert]);

  return (
    <div className="space-y-6 w-full h-[110%] bg-white rounded-xl shadow-sm p-4">
      <div>
        <h1 className="text-xl font-semibold">Update Version</h1>
        <p className="text-sm text-text-light">Update version untuk faskes</p>
        <div className="flex gap-3 mt-4">
          <input
            placeholder="Version (v1.2)"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="border p-2 rounded-lg w-[25%]"
          />
          <div className="relative flex-1">
            <input
              placeholder="Cari nama faskes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 pl-8 rounded-lg w-full"
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mt-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left py-3 px-4 text-white font-semibold border border-primary">
                No
              </th>
              <th className="text-left py-3 px-4 text-white font-semibold border border-primary w-full">
                Nama Faskes
              </th>
              <th className="py-3 px-4 text-center border border-primary">
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer accent-white"
                  checked={
                    selected.length === options.length && options.length > 0
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? options.map((f) => f.id) : [],
                    )
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOptions.map((f: any, i: number) => (
              <tr
                key={f.id}
                className="border-b border-gray-200 last:border-0 hover:bg-orange-50 transition-colors cursor-pointer"
                onClick={() => toggle(f.id)}
              >
                <td className="py-2.5 px-4 text-gray-400 text-xs border border-gray-200">
                  {i + 1}
                </td>
                <td className="py-2.5 px-4 text-gray-700 border border-gray-200">
                  {f.name}
                </td>
                <td className="py-2.5 px-4 text-center border border-gray-200">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer accent-orange-500"
                    checked={
                      filteredOptions.length > 0 &&
                      filteredOptions.every((f) => selected.includes(f.id))
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? filteredOptions.map((f) => f.id)
                          : [],
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        onClick={handleUpdate}
        label={loading ? "Updating..." : "Update Version"}
        disabled={loading}
      />
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
