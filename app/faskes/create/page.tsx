"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FaskesForm from "@/components/faskes/FaskesForm";
import { createFaskes } from "@/services/faskes.service";
import Alert from "@/components/ui/Alert";

export default function CreateFaskesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (data: any) => {
  if (loading) return;

  setLoading(true);

    try {
      console.log("SUBMIT DATA:", data);

      const res = await createFaskes(data);

      console.log("CREATE RESPONSE:", res);

      setAlert({
        message: "Berhasil membuat faskes",
        type: "success",
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (err: any) {
      console.error(err.response?.data);

      setAlert({
        message:
          err.response?.data?.message ||
          "Terjadi kesalahan",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">
        Create Faskes
      </h3>

      <FaskesForm onSubmit={handleSubmit} loading={loading} />

      {/* ALERT */}
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