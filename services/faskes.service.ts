import { api } from "./api";

//get all faskes
export const getFaskes = async (params?: any) => {
  const res = await api.get("/v1/companies", { params });
  return res.data;
};

//get detail
export const getFaskesDetail = async (id: string) => {
  const res = await api.get(`/v1/companies/${id}/details`);
  return res.data;
};

//create
export const createFaskes = async (data: any) => {
  const res = await api.post("/v2/companies", data);
  return res.data;
};
//update
export const updateFaskes = async (id: string, data: any) => {
  const res = await api.put(`/v1/companies/${id}`, data);
  return res.data;
};
