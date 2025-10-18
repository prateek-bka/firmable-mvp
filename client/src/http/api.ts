import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllFilters = async () => {
  return api.get("/api/abn/get-all-filter-options");
};


export const getAllAbnRecords = async (params?: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  state?: string;
  entityType?: string;
  gst?: string;
  sort?: string;
}) => {
  return api.get("/api/abn/search", { params });
};