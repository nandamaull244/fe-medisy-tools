import { api } from "./api";

export const compareFaskes = async (id1: string, id2: string) => {
  const res = await api.get(
    `/v1/companies/compares/table/${id1}/${id2}`
  );
  return res.data;
};