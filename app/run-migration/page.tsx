"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import Select from "@/components/ui/Select";
import { getFaskes } from "@/services/faskes.service";
import { getMigrations, runMigration } from "@/services/migration.service";
import Alert from "@/components/ui/Alert";
import { useSearchParams } from "next/navigation";

type Option = {
  label: string;
  value: string;
};

export default function RunMigrationPage() {
  const [faskes, setFaskes] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loadingRun, setLoadingRun] = useState(false);
  const searchParams = useSearchParams();
  const faskesId = searchParams.get("faskes");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [message, setMessage] = useState("");
  // GET FASKES
  useEffect(() => {
    getFaskes({ size: 100 }).then((res) => {
      setOptions(
        res.map((x: any) => ({
          label: x.name,
          value: String(x.id),
        })),
      );
    });
  }, []);
  useEffect(() => {
    if (!faskesId || options.length === 0) return;

    const found = options.find((o) => o.value === faskesId);

    if (found) {
      setFaskes(found);
    }
  }, [faskesId, options]);

  // LOAD MIGRATION
  const handleLoad = async () => {
    const res = await getMigrations({ size: 50 });
    setData(res.data || []);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const columns = [
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          checked={selected.includes(row.original.id)}
          onChange={() => toggleSelect(row.original.id)}
        />
      ),
    },
    { accessorKey: "batch", header: "Batch" },
    { accessorKey: "created_at", header: "Created" },
  ];

  return (
    <div className="space-y-6 w-full h-[110%] bg-white rounded-xl shadow-sm p-4">
      {/* SELECT */}
      <div className="flex gap-4">
        <Select
          options={options}
          value={faskes?.value}
          onChange={(val) => {
            const selected = options.find((o) => o.value === val);
            setFaskes(selected || null);
          }}
        />

        <button
          onClick={handleLoad}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Load
        </button>
      </div>

      {/* TABLE */}
      <Table columns={columns} data={data} />

      {/* RUN */}
      <button
        onClick={async () => {
          setLoadingRun(true);
          setAlert(null);

          await new Promise((r) => setTimeout(r, 50));

          if (!faskes) {
            setAlert({ message: "Pilih faskes dulu", type: "error" });
            setLoadingRun(false);
            return;
          }

          if (selected.length === 0) {
            setAlert({ message: "Pilih migration dulu", type: "error" });
            setLoadingRun(false);
            return;
          }

          try {
            const res = await runMigration(faskes.value, selected);

            setAlert({
              message: res?.message || "Migration berhasil",
              type: "success",
            });
          } catch (err: any) {
            console.error(err);

            setAlert({
              message: err?.response?.data?.message || "Migration gagal",
              type: "error",
            });
          } finally {
            setLoadingRun(false);
          }
        }}
        disabled={loadingRun}
        className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
      >
        {loadingRun ? "Running..." : "Run Migration"}
      </button>
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
