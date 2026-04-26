"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";

type Props = {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  loading?: boolean;
};

export default function FaskesForm({
  onSubmit,
  defaultValues,
  loading,
}: Props) {
  const [form, setForm] = useState({
    name: defaultValues?.name || "",
    domain: defaultValues?.domain || "",
    username: defaultValues?.username || "",
    password: defaultValues?.password || "",
    dbhost: defaultValues?.dbhost || "",
    dbname: defaultValues?.dbname || "",
    image_version: defaultValues?.image_version || "",
    dockerfile_path: defaultValues?.dockerfile_path || "",
    use_pem_file: defaultValues?.use_pem_file || false,
    install_server: defaultValues?.install_server || false,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="column w-[45%] ">
          {/* Nama */}
          <Input
            label="Nama Faskes"
            placeholder="Masukkan nama"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          {/* Domain */}
          <Input
            label="Domain"
            placeholder="example.medisy.id"
            value={form.domain}
            onChange={(e) => handleChange("domain", e.target.value)}
          />

          {/* Username */}
          <Input
            label="Username"
            placeholder="root"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <br />
          {
            /* Use PEM File */
            <Switch
              label="Use PEM File"
              checked={form.use_pem_file}
              onChange={(value) => handleChange("use_pem_file", value)}
            />
          }
        </div>
        <div className="column w-[45%]">
          {/* Image Version */}
          <Input
            label="Image Version"
            placeholder="v1.0"
            value={form.image_version}
            onChange={(e) => handleChange("image_version", e.target.value)}
          />

          {/* Docker Path */}
          <Input
            label="Dockerfile Path"
            placeholder="/docker/app"
            value={form.dockerfile_path}
            onChange={(e) => handleChange("dockerfile_path", e.target.value)}
          />

          {/* DB Host */}
          <Input
            label="DB Host"
            placeholder="127.0.0.1"
            value={form.dbhost}
            onChange={(e) => handleChange("dbhost", e.target.value)}
          />

          {/* DB Name */}
          <Input
            label="DB Name"
            placeholder="nama_database"
            value={form.dbname}
            onChange={(e) => handleChange("dbname", e.target.value)}
          />
          <br />
          <Switch
            label="Install Server?"
            checked={form.install_server}
            onChange={(value) => handleChange("install_server", value)}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-6 justify-self-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
