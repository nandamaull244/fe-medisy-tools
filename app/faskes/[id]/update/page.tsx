"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FaskesForm from "@/components/faskes/FaskesForm";
import { getFaskesDetail, updateFaskes } from "@/services/faskes.service";
import Alert from "@/components/ui/Alert";

export default function EditFaskesPage() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  //GET DETAIL
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getFaskesDetail(params.id as string);
        setData(res);
      } catch (err) {
        setAlert({
          message: "Gagal mengambil data",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [params.id]);

  // SUBMIT UPDATE
  const handleSubmit = async (form: any) => {
    try {
      await updateFaskes(params.id as string, form);

      setAlert({
        message: "Berhasil update faskes",
        type: "success",
      });

      setTimeout(() => {
        router.push(`/faskes/${params.id}`);
      }, 1500);
    } catch (err: any) {
      setAlert({
        message: err?.response?.data?.message || "Gagal update",
        type: "error",
      });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Edit Faskes</h2>

      <FaskesForm defaultValues={data} onSubmit={handleSubmit} />

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
