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
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [searchBatch, setSearchBatch] = useState("");

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  // FORMAT TANGGAL
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // FILTER DATA BERDASARKAN SEARCH BATCH
  const filteredData = data.filter((item) =>
    item.batch?.toLowerCase().includes(searchBatch.toLowerCase()),
  );

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
    {
      accessorKey: "batch",
      header: "Batch",
    },
    {
      accessorKey: "sqlcode",
      header: "SQL",
      cell: ({ row }: any) => (
        <p className="truncate max-w-md">{row.original.sqlcode}</p>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }: any) => formatDate(row.original.created_at),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: any) => (
        <button
          onClick={() => setSelectedBatch(row.original)}
          className="text-primary"
        >
          Detail
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full h-[110%] bg-white rounded-xl shadow-sm p-4">
      {/* SELECT FASKES */}
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
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* SEARCH BATCH */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search batch..."
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-72"
          />
        </div>

        <Table columns={columns} data={filteredData} />

        {/* MODAL DETAIL */}
        {selectedBatch && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[80%] max-h-[80%] overflow-y-auto rounded-xl p-6 shadow-lg">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Batch: {selectedBatch.batch}
                </h2>

                <button
                  onClick={() => setSelectedBatch(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* INFO */}
              <p className="text-sm text-gray-500 mb-4">
                Migration ID: {selectedBatch.id}
              </p>

              {/* SQL */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-400">SQL Migration</p>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(selectedBatch.sqlcode)
                    }
                    className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-200"
                  >
                    Copy
                  </button>
                </div>

                <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                  {selectedBatch.sqlcode}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RUN MIGRATION */}
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
            console.log("SELECTED IDS:", selected);

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
