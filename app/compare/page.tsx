"use client";

import { useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function ComparePage() {
  const [faskesA, setFaskesA] = useState<any>(null);
  const [faskesB, setFaskesB] = useState<any>(null);


  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [result, setResult] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<string>("User");

  const options = [
    { label: "Klinik Bunda", value: "1" },
    { label: "Klinik Maju Terus", value: "2" },
  ];

  const handleCompare = async () => {
    // 🔴 VALIDASI
    if (!faskesA || !faskesB) {
      alert("Pilih kedua faskes terlebih dahulu");
      return;
    }

    setStatus("loading");

    try {
      await new Promise((res) => setTimeout(res, 1000));

      setResult({
        tablesOnlyA: ["Doctors"],
        tablesOnlyB: ["Appointments"],
        tablesSame: ["User", "Patients"],

        columnDifferences: {
          User: {
            A: ["id", "name", "email"],
            B: ["id", "name", "phone"],
          },
          Patient: {
            A: ["id", "name"],
            B: ["id", "name", "email"],
          },
        },
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const getColumns = () => {
    if (!result || !selectedTable) return [];

    const colA = result.columnDifferences[selectedTable].A;
    const colB = result.columnDifferences[selectedTable].B;

    const all = Array.from(new Set([...colA, ...colB]));

    return all.map((col) => ({
      name: col,
      A: colA.includes(col),
      B: colB.includes(col),
    }));
  };

  return (
    <div className="space-y-6 w-full h-full bg-white rounded-xl shadow-sm p-4">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">
          Compare Database
        </h1>
        <p className="text-sm text-text-light">
          Compare struktur database antar faskes
        </p>
      </div>

      {/* FORM */}
      <div className="flex gap-4 items-end">
        <Select
          value={faskesA?.value}
          options={options}
          onChange={(val) => {
            const selected = options.find((o) => o.value === val);
            setFaskesA(selected);
          }}
        />

        <Select
          value={faskesB?.value}
          options={options}
          onChange={(val) => {
            const selected = options.find((o) => o.value === val);
            setFaskesB(selected);
          }}
        />

        <Button
          label={status === "loading" ? "Loading..." : "Compare"}
          onClick={handleCompare}
        />
      </div>

      {/* ================= */}
      {/* STATE */}
      {/* ================= */}

      {status === "idle" && (
        <div className="text-text-light">
          Belum ada data comparasi
        </div>
      )}

      {status === "loading" && (
        <div className="text-text-light">
          Sedang membandingkan data...
        </div>
      )}

      {status === "error" && (
        <div className="bg-background p-6 rounded-xl shadow-sm text-center">
          <p className="text-red-500 mb-3">
            Data gagal compare
          </p>

          <Button label="Coba Lagi" onClick={handleCompare} />
        </div>
      )}

      {/* ================= */}
      {/* SUCCESS */}
      {/* ================= */}

      {status === "success" && result && (
        <>
          {/* TOP CARDS */}
          <div className="grid grid-cols-2 gap-4">

            {/* Ringkasan */}
            <div className="bg-background p-5 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">Ringkasan</h3>

              <p className="text-sm text-text-light">
                {result.tablesOnlyA.length} tabel hanya di Faskes A
              </p>
              <p className="text-sm text-text-light">
                {result.tablesOnlyB.length} tabel hanya di Faskes B
              </p>
              <p className="text-sm text-text-light">
                {Object.keys(result.columnDifferences).length} tabel memiliki perbedaan kolom
              </p>
            </div>

            {/* Table Differences */}
            <div className="bg-background p-5 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-3">
                Table Differences
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-medium pb-2">{faskesA.label}</p>
                  {result.tablesOnlyA.map((t: string) => (
                    <span 
                    key={t}
                    className="px-3 py-1 border bg-white border-red-400 rounded-lg text-sm">
                      {t}  
                    </span>
                  ))}
                </div>

                <div>
                    <p className="font-medium pb-2">{faskesA.label}</p>
                    {result.tablesOnlyB.map((t: string) => (
                      <span 
                      key={t}
                      className="px-3 py-1 border bg-white border-red-400 rounded-lg text-sm">
                        {t}
                      </span>
                    ))}
                </div>

                <div>
                    <p className="font-medium pb-2">Table yang sama</p>
                    <div className="flex flex-col gap-2">
                        {result.tablesSame.map((t: string) => (
                          <span 
                          key={t}
                          className="px-3 py-1 border bg-white border-green-400 rounded-lg text-sm">
                            {t}
                          </span>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN DIFFERENCES */}
          <div className="grid grid-cols-3 gap-4">

            {/* LEFT LIST */}
            <div className="bg-background p-4 rounded-xl shadow-sm space-y-2">
              <h3 className="font-semibold mb-2">
                Column Differences
              </h3>

              {Object.keys(result.columnDifferences).map((table) => (
                <div
                  key={table}
                  onClick={() => setSelectedTable(table)}
                  className={`p-3 rounded-lg cursor-pointer border bg-white ${
                    selectedTable === table
                      ? "border-green-500"
                      : "border-gray-dark"
                  }`}
                >
                  {table}
                </div>
              ))}
            </div>

            {/* TABLE */}
            <div className="col-span-2 bg-background p-4 rounded-xl shadow-sm">

              <table className="w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-2 text-left">Column</th>
                    <th className="p-2">Faskes A</th>
                    <th className="p-2">Faskes B</th>
                  </tr>
                </thead>

                <tbody>
                  {getColumns().map((row, i) => (
                    <tr key={i} className="border-t bg-white text-center">
                      <td className="p-2 text-left">{row.name}</td>

                      <td className="p-2">
                        {row.A ? (
                          <span className="text-green-500">
                            available
                          </span>
                        ) : (
                          <span className="text-red-500">
                            unavailable
                          </span>
                        )}
                      </td>

                      <td className="p-2">
                        {row.B ? (
                          <span className="text-green-500">
                            available
                          </span>
                        ) : (
                          <span className="text-red-500">
                            unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </>
      )}
    </div>
  );
}