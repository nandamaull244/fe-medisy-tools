"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import {
  getMigrations,
  createMigration,
  deleteMigration,
  updateMigration,
} from "@/services/migration.service";

export default function MigrationPage() {
  const [batch, setBatch] = useState("");
  const [sqlList, setSqlList] = useState<string[]>([""]);

  const [filterBatch, setFilterBatch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

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

  // ADD SQL
  const addSql = () => {
    setSqlList((prev) => [...prev, ""]);
  };

  // REMOVE SQL
  const removeSql = (index: number) => {
    setSqlList((prev) => prev.filter((_, i) => i !== index));
  };

  // UPDATE SQL
  const updateSql = (index: number, value: string) => {
    const copy = [...sqlList];
    copy[index] = value;
    setSqlList(copy);
  };

  // CREATE BATCH
  const handleCreateBatch = async () => {
    if (!batch) {
      alert("Batch wajib diisi");
      return;
    }

    const validSql = sqlList.filter((sql) => sql.trim() !== "");

    if (validSql.length === 0) {
      alert("Minimal 1 SQL harus diisi");
      return;
    }

    setLoading(true);

    try {
      await Promise.all(
        validSql.map((sql) =>
          createMigration({
            batch,
            sqlcode: sql,
          }),
        ),
      );

      alert("Batch berhasil dibuat");

      setBatch("");
      setSqlList([""]);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal create batch");
    } finally {
      setLoading(false);
    }
  };

  //GROUPING
  const groupByBatch = (list: any[]) => {
    const map: any = {};

    list.forEach((item) => {
      if (!map[item.batch]) {
        map[item.batch] = {
          batch: item.batch,
          items: [],
          created_at: item.created_at,
        };
      }

      map[item.batch].items.push(item);
    });

    return Object.values(map);
  };

  //FORMAT TANGGAL
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

  // DELETE
  const handleDeleteMigration = async (id: number) => {
    if (!confirm("Hapus migration ini?")) return;

    try {
      await deleteMigration(id);

      await fetchData();

      setSelectedBatch((prev: any) => {
        if (!prev) return prev;

        const newItems = prev.items.filter((item: any) => item.id !== id);

        if (newItems.length === 0) {
          return null;
        }

        return {
          ...prev,
          items: newItems,
        };
      });
    } catch (err) {
      alert("Gagal delete");
    }
  };
  //EDIT
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditValue(item.sqlcode);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateMigration(id, {
        sqlcode: editValue,
      });

      setEditingId(null);

      await fetchData();

      setSelectedBatch((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          items: prev.items.map((item: any) =>
            item.id === id ? { ...item, sqlcode: editValue } : item,
          ),
        };
      });
    } catch (err) {
      alert("Gagal update");
    }
  };

  const columns = [
    {
      accessorKey: "batch",
      header: "Batch",
    },
    {
      accessorKey: "sqlcode",
      header: "SQL Code",
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
  // const groupedData = groupByBatch(data);

  return (
    <div className="space-y-6">
      {/* CREATE BATCH */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-4">Create Batch Migration</h2>

        <Input
          label="Batch Version"
          placeholder="v1.3"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />

        {/* SQL LIST */}
        <div className="space-y-3 mt-4">
          {sqlList.map((sql, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={sql}
                onChange={(e) => updateSql(index, e.target.value)}
                className="w-full border p-3 rounded"
                placeholder={`SQL ${index + 1}`}
              />

              {sqlList.length > 1 && (
                <button
                  onClick={() => removeSql(index)}
                  className="text-red-500 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ACTION */}
        <div className="flex gap-3 mt-4">
          <button onClick={addSql} className="px-3 py-2 bg-gray-light rounded">
            + Add SQL
          </button>

          <button
            onClick={handleCreateBatch}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            {loading ? "Saving..." : "Create Batch"}
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <Input
          label="Search Batch"
          placeholder="v1.1"
          value={filterBatch}
          onChange={(e) => setFilterBatch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <Table columns={columns} data={data} />
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
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              {/* INFO */}
              <p className="text-sm text-gray-500 mb-4">
                Batch: {selectedBatch.batch}
              </p>

              {/* SQL LIST */}
              {/* SQL DETAIL */}
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400">SQL Migration</p>

                    <div className="flex gap-2">
                      {/* COPY */}
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(selectedBatch.sqlcode)
                        }
                        className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-200"
                      >
                        Copy
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => handleEdit(selectedBatch)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDeleteMigration(selectedBatch.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* CONTENT */}
                  {editingId === selectedBatch.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full border p-2 rounded min-h-[150px]"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(selectedBatch.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-300 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-words">
                      {selectedBatch.sqlcode}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
