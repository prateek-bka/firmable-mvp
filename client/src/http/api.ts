import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookies
});

// Track if refreshing the token
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle 401 errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth/me endpoint (it's used to check auth status)
    if (originalRequest.url?.includes('/auth/me')) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        await api.post("/auth/refresh");
        processQueue(null, null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Refresh token failed, redirect to login (unless already on auth pages)
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const login = async (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};

export const register = async (email: string, password: string, name?: string) => {
  return api.post("/auth/register", { email, password, name });
};

export const logout = async () => {
  return api.post("/auth/logout");
};

export const checkAuth = async () => {
  return api.get("/auth/me");
};

// ABN API endpoints
export const getAllFilters = async () => {
  return api.get("/abn/get-all-filter-options");
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
  return api.get("/abn/search", { params });
};
