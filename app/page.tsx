"use client";

import { useEffect, useState } from "react";
import { getFaskes } from "@/services/faskes.service";
import Table from "@/components/ui/Table";
import { Icons } from "@/icons";
import { access } from "fs";


export default function FaskesPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");


  const [debounced, setDebounced] = useState(search);

  

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
    }, 500);

    return () => clearTimeout(t);
  }, [search]);

  // fetch API
  useEffect(() => {
    getFaskes({
      page,
      size: 10,
      order_by: "created_at",
      order: "desc",
      name: debounced,
    }).then(setData);
  }, [page, debounced]);


    const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => (page - 1) * 10 + row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "domain",
      header: "Domain",
    },
    {
      accessorKey: "dbname",
      header: "DB Name",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: any) => (
      <div className="flex items-center">
        <a href={`/faskes/${row.original.id}`} className="text-success hover:text-green-800">
        <Icons.search size={18} />
        </a>

      </div>
      ),
    },
    ];

  return (
    <div className="space-y-4">

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Cari faskes..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset page
        }}
        className="border px-3 py-2 rounded-lg text-sm w-64"
      />

      {/*TABLE */}
      <Table
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}