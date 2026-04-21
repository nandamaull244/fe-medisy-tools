"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function Table({ columns, data, page, setPage }: any) {
  const table = useReactTable({
    data,
    columns,
    pageCount: -1, // server-side
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
    manualPagination: true, 
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            )}

            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-light">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <span>Page {page}</span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p: number) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-light rounded"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p: number) => p + 1)}
            className="px-3 py-1 bg-primary text-white rounded"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}