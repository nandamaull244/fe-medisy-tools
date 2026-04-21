"use client";

import { Icons } from "@/icons";

type AlertProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Alert({
  message,
  type = "success",
  onClose,
}: AlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      {/* Modal */}
      <div className="bg-white rounded-xl shadow-lg w-[320px] p-6 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {type === "success" ? (
            <div className="bg-green-100 p-4 rounded-full">
              <Icons.check className="text-green-500" size={32} />
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded-full">
              <Icons.close className="text-red-500" size={32} />
            </div>
          )}
        </div>

        {/* Message */}
        <p className="text-sm text-gray-700 mb-5">
          {message}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg text-sm font-medium text-white ${
            type === "success"
              ? "bg-green-500 hover:opacity-90"
              : "bg-red-500 hover:opacity-90"
          }`}
        >
          OK
        </button>

      </div>
    </div>
  );
}