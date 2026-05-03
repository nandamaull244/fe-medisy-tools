import { api } from "./api";

// GET migrations
export const getMigrations = async (params?: any) => {
  const res = await api.get("/v1/migrations", { params });
  return res.data;
};

// CREATE
export const createMigration = async (data: {
  batch: string;
  sqlcode: string;
}) => {
  const res = await api.post("/v1/migrations", data);
  return res.data;
};

// DELETE
export const deleteMigration = async (id: number) => {
  const res = await api.delete(`/v1/migrations/${id}`);
  return res.data;
};

// RUN migration
export const runMigration = async (companyId: string, ids: number[]) => {
  const res = await api.post(`/v1/migrations/company/${companyId}`, { ids });
  return res.data;
};

// UPDATE VERSION
export const updateVersion = async (data: {
  include_ids?: number[];
  exclude_ids?: number[];
  target: string;
}) => {
  const res = await api.put("/v2/image-version", data);
  return res.data;
};

export const updateMigration = async (id: number, data: any) => {
  const res = await api.put(`/v1/migrations/${id}`, data);
  return res.data;
};
