"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FaskesDetail from "@/components/faskes/FaskesDetail";
import { Icons } from "@/icons";
import Button from "@/components/ui/Button";
import { getFaskesDetail } from "@/services/faskes.service";
import { useRouter } from "next/navigation";

export default function DetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getFaskesDetail(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!data) return <div>Data tidak ditemukan</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="inline-flex items-center gap-3">
        <a href="/" className="text-gray-dark hover:text-gray-900">
          <Icons.arrow_left size={24} />
        </a>
        <h1 className="text-xl font-semibold">Detail Faskes</h1>
      </div>

      {/* Title + Action */}
      <div className="flex gap-4 mt-4 px-3">
        <div className="flex gap-4 w-full">
          <h2 className="text-xl font-bold">{data.name}</h2>

          <div className="ml-auto flex items-center gap-2">
            <Button
              icon={<Icons.edit size={16} />}
              label="Edit Faskes"
              variant="primary"
              onClick={() => router.push(`/faskes/${id}/update`)}
            />

            <Button
              icon={<Icons.compare size={16} />}
              label="Compare"
              variant="purple"
              onClick={() => router.push(`/compare?faskesA=${data.id}`)}
            />

            <Button
              icon={<Icons.migration size={16} />}
              label="Run Migration"
              variant="success"
              onClick={() => router.push(`/run-migration?faskes=${data.id}`)}
            />
          </div>
        </div>
      </div>

      {/* Detail Info */}
      <FaskesDetail data={data} />
    </div>
  );
}
