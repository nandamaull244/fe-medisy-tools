"use client";
import Table from "@/components/ui/Table";
import { access } from "fs";
import { Icons } from "@/icons";


export default function Home() {
    const data = [
    { id: 1, name: "Klinik A", domain: "a.medisy.id", db_name: "klinik_a", created_at: "2023-01-01" },
    { id: 2, name: "Klinik B", domain: "b.medisy.id", db_name: "klinik_b", created_at: "2023-01-02" },
    { id: 3, name: "Klinik C", domain: "c.medisy.id", db_name: "klinik_c", created_at: "2023-01-03" },
  ];

  const columns = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "domain",
      header: "Domain",
    },
    {
      accessorKey: "db_name",
      header: "DB Name",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <button className="text-success font-medium">
            <Icons.search size={18} />
          </button>
          <button className="text-red-500 font-medium">
            <Icons.delete size={18} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-xl font-semibold mb-4">List Faskes</h3>
      <div>
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}
