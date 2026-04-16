"use client";

import FaskesForm from "@/components/faskes/FaskesForm";
// import { createFaskes } from "@/services/faskes.service";

export default function CreateFaskesPage() {
//   const handleSubmit = async (data: any) => {
//     try {
//       await createFaskes(data);
//       alert("Berhasil membuat faskes");
//     } catch (err) {
//       console.error(err);
//       alert("Gagal");
//     }
//   };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">List Faskes</h3>
          <div>
            <FaskesForm onSubmit={() => {}} />
          </div>
        </div>
  );
}