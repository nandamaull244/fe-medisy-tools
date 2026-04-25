import { api } from "./api";

export const getMigrations = async (params?: any) => {
  const res = await api.get("/v1/migrations", { params });
  return res.data;
};

export const runMigration = async (companyId: string, ids: number[]) => {
  const res = await api.post(`/v1/migrations/company/${companyId}`, { ids });
  return res.data;
};
