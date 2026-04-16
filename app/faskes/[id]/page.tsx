"use client";

import FaskesDetail from "@/components/faskes/FaskesDetail";
import { Icons } from "@/icons";
import { Icon } from "lucide-react";
import Button from "@/components/ui/Button";



export default function DetailPage() {
  const data = {
    id: 1,
    name: "Klinik Maju Sehat",
    domain: "maju.medisy.id",
    username: "admin",
    password: "secret",
    use_pem_file: true,
    image_version: "v1.0",
    dockerfile_path: "/docker/app",
    dbhost: "127.0.0.1",
    dbname: "db_klinik",
    created_at: "2026-01-01",
    updated_at: "2026-01-02",
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-3">
       <a href="/faskes" className="text-gray-dark hover:text-gray-900">
          <Icons.arrow_left size={24} />
        </a> 
        <h1 className="text-xl font-semibold">Detail Faskes</h1>
      </div>
      <div className="flex items-space-between gap-4 mt-4 px-3">
        <div className="flex items-spacae-between gap-4 w-full">
          <h2 className="text-xl font-bold">{data.name}</h2>
          <div className="ml-auto flex items-center gap-2">
            <Button icon={<Icons.edit size={16} />} label="Edit Faskes" type="button" variant="primary"></Button>
            <Button icon={<Icons.search size={16} />} label="Compare" type="button" variant="purple"></Button>
            <Button icon={<Icons.migration size={16} />} label="Run Migration" type="button" variant="success"></Button>
          </div>
        </div>
      </div>
      <FaskesDetail data={data} />
    </div>
  );
}