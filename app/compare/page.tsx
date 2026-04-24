"use client";

import { useEffect, useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { compareFaskes } from "@/services/compare.service";
import { getFaskes } from "@/services/faskes.service";

export default function ComparePage() {
  const [faskesA, setFaskesA] = useState<any>(null);
  const [faskesB, setFaskesB] = useState<any>(null);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  const [result, setResult] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<string>("User");
  const [loadingOptions, setLoadingOptions] = useState(true);
  useEffect(() => {
    setLoadingOptions(true);

    getFaskes({ size: 100 })
      .then((res) => {
        setOptions(
          res.map((item: any) => ({
            label: item.name,
            value: String(item.id),
          })),
        );
      })
      .finally(() => {
        setLoadingOptions(false);
      });
  }, []);

  useEffect(() => {
    getFaskes({ size: 100 }) // ambil banyak dulu
      .then((res) => {
        const mapped = res.map((item: any) => ({
          label: item.name,
          value: String(item.id),
        }));

        setOptions(mapped);
      })
      .catch((err) => {
        console.error("Gagal ambil faskes", err);
      });
  }, []);
  const handleCompare = async () => {
    // console.log("tombol diklik");
    if (!faskesA || !faskesB) {
      alert("Pilih kedua faskes terlebih dahulu");
      return;
    }

    if (faskesA.value === faskesB.value) {
      alert("Tidak boleh memilih faskes yang sama");
      return;
    }

    setStatus("loading");

    try {
      const res = await compareFaskes(faskesA.value, faskesB.value);

      console.log("COMPARE RESULT:", res);

      // mapping hasil API ke format UI
      // const keys = Object.keys(res).filter((k) => k !== "columnDifferences");
      // const tablesA = keys[0];
      // const tablesB = keys[1];
      const nameA = faskesA.label;
      const nameB = faskesB.label;

      const listA = res[nameA] || [];
      const listB = res[nameB] || [];

      const tablesSame = listA.filter((t: string) => listB.includes(t));

      const tablesOnlyA = listA.filter((t: string) => !listB.includes(t));

      const tablesOnlyB = listB.filter((t: string) => !listA.includes(t));
      console.log("NAME A:", nameA);
      console.log("NAME B:", nameB);
      console.log("LIST A:", listA.length);
      console.log("LIST B:", listB.length);
      console.log("SAME:", tablesSame.length);

      //FILTER columnDifferences
      const filteredColumnDiff = Object.fromEntries(
        Object.entries(res.columnDifferences || {}).filter(([table]) =>
          tablesSame.includes(table),
        ),
      );

      setResult({
        tablesOnlyA,
        tablesOnlyB,
        tablesSame,
        columnDifferences: filteredColumnDiff || {},
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const getColumns = () => {
    if (!result || !selectedTable) return [];

    if (!result.tablesSame.includes(selectedTable)) return [];

    const tableDiff = result.columnDifferences?.[selectedTable];
    if (!tableDiff) return [];

    const colA = tableDiff[faskesA.label] || [];
    const colB = tableDiff[faskesB.label] || [];

    const all = Array.from(new Set([...colA, ...colB]));
    console.log("TABLE DIFF:", tableDiff);
    console.log("KEYS:", Object.keys(tableDiff || {}));
    console.log("FASKES A:", faskesA);
    console.log("FASKES B:", faskesB);

    return all;
  };

  return (
    <div className="space-y-6 w-full h-[110%] bg-white rounded-xl shadow-sm p-4">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Compare Database</h1>
        <p className="text-sm text-text-light">
          Compare struktur database antar faskes
        </p>
      </div>

      {/* FORM */}
      <div className="flex gap-4 items-end">
        {loadingOptions ? (
          <p>Loading faskes...</p>
        ) : (
          <>
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
          </>
        )}

        <button
          onClick={handleCompare}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" && (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
          )}
          {status === "loading" ? "Comparing..." : "Compare"}
        </button>
      </div>

      {/* ================= */}
      {/* STATE */}
      {/* ================= */}

      {status === "idle" && (
        <div className="text-text-light">Belum ada data comparasi</div>
      )}

      {status === "loading" && (
        <div className="text-text-light">Sedang membandingkan data...</div>
      )}

      {status === "error" && (
        <div className="bg-background p-6 rounded-xl shadow-sm text-center">
          <p className="text-red-500 mb-3">Data gagal compare</p>

          <Button label="Coba Lagi" onClick={handleCompare} />
        </div>
      )}

      {/* ================= */}
      {/* SUCCESS */}
      {/* ================= */}

      {status === "success" && result && (
        <>
          {/* TOP CARDS */}
          <div className="grid grid-cols-3 gap-4">
            {/* Ringkasan */}
            <div className="bg-background p-5 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">Ringkasan</h3>

              <p className="text-sm text-text-light">
                {result.tablesOnlyA.length} tabel hanya di Faskes{" "}
                {faskesA.label}
              </p>
              <p className="text-sm text-text-light">
                {result.tablesOnlyB.length} tabel hanya di Faskes{" "}
                {faskesB.label}
              </p>
              <p className="text-sm text-text-light">
                {result.tablesSame.length} tabel sama di kedua Faskes
              </p>

              <p className="text-sm text-text-light">
                {Object.keys(result.columnDifferences).length} tabel memiliki
                perbedaan kolom
              </p>
            </div>

            {/* Table Differences */}
            <div className="bg-background p-5 rounded-xl shadow-sm col-span-2">
              <h3 className="font-semibold mb-3">Table Differences</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p>Hanya ada di : </p>
                  <p className="font-medium pb-2">{faskesA.label}</p>
                  {result.tablesOnlyA.map((t: string) => (
                    <span
                      key={t}
                      className="px-3 py-1 border bg-white border-red-400 rounded-lg text-sm columns-1 inline-block mb-2"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div>
                  <p>Hanya ada di :</p>
                  <p className="font-medium pb-2">{faskesB.label}</p>
                  {result.tablesOnlyB.map((t: string) => (
                    <span
                      key={t}
                      className="px-3 py-1 border bg-white border-red-400 rounded-lg text-sm columns-1 inline-block mb-2"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {result.tablesSame.length === 0 ? (
                  <div className="hidden"></div>
                ) : (
                  result.tablesSame.map((t: string) => (
                    <div key={`Both-${t}`}>
                      <span className="px-3 py-1 border bg-white border-green-400 rounded-lg text-sm columns-1 inline-block mb-2">
                        {t}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* COLUMN DIFFERENCES */}
          <div className="grid grid-cols-3 gap-4">
            {/* LEFT LIST */}
            <div className="bg-background p-4 rounded-xl shadow-sm space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
              <h3 className="font-semibold mb-2">Column Differences</h3>
              {Object.keys(result.columnDifferences).length === 0 && (
                <p className="text-sm text-gray-400">
                  Tidak ada perbedaan kolom (tidak ada tabel yang sama)
                </p>
              )}

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
            <div className="col-span-2 bg-background p-4 rounded-xl shadow-sm max-h-[400px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-2 text-left">Column</th>
                    <th className="p-2">Faskes A</th>
                    <th className="p-2">Faskes B</th>
                  </tr>
                </thead>

                <tbody>
                  {getColumns().map((column: string) => {
                    const tableDiff =
                      result?.columnDifferences?.[selectedTable];

                    const keys = Object.keys(tableDiff || {});

                    const colA = tableDiff?.[keys[0]] || [];
                    const colB = tableDiff?.[keys[1]] || [];

                    const isInA = colA.includes(column);
                    const isInB = colB.includes(column);

                    return (
                      <tr key={column} className="border-t">
                        {/* Nama column */}
                        <td className="p-2">{column}</td>

                        {/* Faskes A */}
                        <td
                          className={`p-2 ${isInA ? "text-green-500" : "text-red-500"}`}
                        >
                          {isInA ? "available" : "unavailable"}
                        </td>

                        {/* Faskes B */}
                        <td
                          className={`p-2 ${isInB ? "text-green-500" : "text-red-500"}`}
                        >
                          {isInB ? "available" : "unavailable"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
