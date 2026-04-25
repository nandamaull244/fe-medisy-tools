"use client";

import { useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function MigrationPage() {
  const [faskes, setFaskes] = useState<any>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "empty" | "success" | "error"
  >("idle");

  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [detail, setDetail] = useState<any>(null);

  const options = [
    { label: "Klinik Bunda", value: "1" },
    { label: "Klinik Maju Terus", value: "2" },
    { label: "Klinik Keluarga Sehat", value: "3" },
  ];

  const handleLoad = async () => {
    if (!faskes) {
      alert("Pilih faskes terlebih dahulu");
      return;
    }

    setStatus("loading");
    setDetail(null);
    setSelected([]);

    try {
      await new Promise((res) => setTimeout(res, 1000));

      //dummy data
      const dummy = [
        {
          id: 1,
          batch: "v1.0",
          note: "add email column",
          created_at: "2024-03-31 10:29",
          sqlcode: "ALTER TABLE user ADD email VARCHAR(255);",
        },
        {
          id: 2,
          batch: "v1.0",
          note: "create patients table",
          created_at: "2024-03-31 10:29",
          sqlcode: "CREATE TABLE patients (...);",
        },
        {
          id: 3,
          batch: "v1.1",
          note: "add phone column",
          created_at: "2024-03-31 10:29",
          sqlcode: "ALTER TABLE user ADD phone VARCHAR(20);",
        },
      ];

      if (dummy.length === 0) {
        setStatus("empty");
      } else {
        setData(dummy);
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-6 w-full h-full bg-white rounded-xl shadow-sm p-4">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Migration</h1>
        <p className="text-sm text-text-light">
          Jalankan migration ke database faskes
        </p>
      </div>

      {/* SELECT */}
      <div className="flex gap-4 items-end">
        <Select
          label="Pilih Faskes"
          options={options}
          value={faskes?.value}
          onChange={(val) => {
            const selected = options.find((o) => o.value === val);
            setFaskes(selected);
          }}
        />

        <button
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
          onClick={handleLoad}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Loading..." : "Pilih"}
        </button>
      </div>

      {/* ========================= */}
      {/* STATE UI */}
      {/* ========================= */}

      {/* IDLE */}
      {status === "idle" && (
        <div className="text-text-light">
          Pilih faskes untuk melihat migration
        </div>
      )}

      {/* LOADING */}
      {status === "loading" && (
        <div className="text-text-light">Memuat data migration...</div>
      )}

      {/* EMPTY */}
      {status === "empty" && (
        <div className="text-center text-text-light">no data available yet</div>
      )}

      {/* ERROR */}
      {status === "error" && (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-red-500 mb-3">Data gagal compare</p>

          <Button label="Coba Lagi" onClick={handleLoad} />
        </div>
      )}

      {/* SUCCESS */}
      {status === "success" && (
        <div className="grid grid-cols-3 gap-4">
          {/* TABLE */}
          <div className="col-span-2 bg-white p-4 rounded-xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-primary text-white rounded-tl-xl rounded-tr-xl">
                <tr>
                  <th className="p-2"></th>
                  <th className="p-2 text-left">Batch</th>
                  <th className="p-2 text-left">Created At</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-t">
                    {/* Checkbox */}
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>

                    <td className="p-2">{item.batch}</td>
                    <td className="p-2">{item.created_at}</td>

                    {/* Detail */}
                    <td className="p-2">
                      <button
                        className="text-primary text-sm"
                        onClick={() => setDetail(item)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* RUN BUTTON */}
            <div className="mt-4 text-right">
              <Button label="Run migration" disabled={selected.length === 0} />
            </div>
          </div>

          {/* DETAIL PANEL */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            {!detail && (
              <p className="text-text-light text-sm">
                Pilih migration untuk melihat detail
              </p>
            )}

            {detail && (
              <>
                <h3 className="font-semibold mb-2">Migration Detail</h3>

                <p className="text-sm">
                  <b>Batch:</b> {detail.batch}
                </p>

                <p className="text-sm">
                  <b>Note:</b> {detail.note}
                </p>

                <p className="text-sm mt-2">
                  <b>SQL:</b>
                </p>

                <pre className="bg-gray-light p-2 rounded text-xs mt-1">
                  {detail.sqlcode}
                </pre>

                <div className="mt-4 text-right">
                  <Button label="Close" onClick={() => setDetail(null)} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
