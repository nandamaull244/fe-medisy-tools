export default function FaskesDetail({ data }: any) {
  //FORMAT TANGGAL
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Informasi Umum */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Informasi Umum</h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-text-light">Nama</p>
            <p className="font-medium">{data.name}</p>
          </div>

          <div>
            <p className="text-sm text-text-light">Domain</p>
            <p className="font-medium">{data.domain}</p>
          </div>

          <div>
            <p className="text-sm text-text-light">Username</p>
            <p className="font-medium">{data.username}</p>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Authentication</h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-text-light">Use PEM File</p>
            <p className="font-medium">{data.use_pem_file ? "Ya" : "Tidak"}</p>
          </div>

          <div>
            <p className="text-sm text-text-light">Password</p>
            <p className="font-medium">
              {data.password ? data.password : "Tidak ada password"}
            </p>
          </div>
        </div>
      </div>

      {/* Deployment */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Deployment</h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-text-light">Image Version</p>
            <p className="font-medium">{data.image_version}</p>
          </div>

          <div>
            <p className="text-sm text-text-light">Dockerfile Path</p>
            <p className="font-medium">{data.dockerfile_path}</p>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Database</h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-text-light">DB Host</p>
            <p className="font-medium">{data.dbhost}</p>
          </div>

          <div>
            <p className="text-sm text-text-light">DB Name</p>
            <p className="font-medium">{data.dbname}</p>
          </div>
          <div>
            <p className="text-sm text-text-light">DB Port</p>
            <p className="font-medium">{data.dbport}</p>
          </div>
          <div>
            <p className="text-sm text-text-light">DB User</p>
            <p className="font-medium">{data.dbuser}</p>
          </div>
          <div>
            <p className="text-sm text-text-light">DB Password</p>
            <p className="font-medium">
              {data.dbpassword ? data.dbpassword : "Tidak ada password"}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-light">Created At</p>
            <p className="font-medium">{formatDate(data.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-text-light">Updated At</p>
            <p className="font-medium">{formatDate(data.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
