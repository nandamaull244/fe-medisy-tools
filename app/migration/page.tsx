"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import {
  getMigrations,
  createMigration,
  deleteMigration,
} from "@/services/migration.service";

export default function MigrationPage() {
  const [batch, setBatch] = useState("");
  const [sqlcode, setSqlcode] = useState("");

  const [filterBatch, setFilterBatch] = useState("");
  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // FETCH
  const fetchData = async () => {
    try {
      const res = await getMigrations({
        size: 50,
        batch: filterBatch || undefined,
      });
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterBatch]);

  //CREATE
  const handleCreate = async () => {
    if (!batch || !sqlcode) {
      alert("Batch dan SQL wajib diisi");
      return;
    }

    setLoading(true);

    try {
      await createMigration({ batch, sqlcode });

      setBatch("");
      setSqlcode("");

      fetchData();
    } catch (err) {
      alert("Gagal create");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus migration?")) return;

    await deleteMigration(id);
    fetchData();
  };

  const columns = [
    {
      accessorKey: "batch",
      header: "Batch",
    },
    {
      accessorKey: "sqlcode",
      header: "SQL",
      cell: ({ row }: any) => (
        <p className="truncate max-w-xs">{row.original.sqlcode}</p>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }: any) => (
        <button
          onClick={() => handleDelete(row.original.id)}
          className="text-red-500"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* CREATE */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-4">Create Migration</h2>

        <Input
          label="Batch"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />

        <textarea
          value={sqlcode}
          onChange={(e) => setSqlcode(e.target.value)}
          className="w-full border p-3 mt-3 rounded"
          placeholder="SQL..."
        />

        <button
          onClick={handleCreate}
          className="mt-3 px-4 py-2 bg-primary text-white rounded"
        >
          {loading ? "Saving..." : "Create"}
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <Input
          label="Filter Batch"
          placeholder="v1.1"
          value={filterBatch}
          onChange={(e) => setFilterBatch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}
