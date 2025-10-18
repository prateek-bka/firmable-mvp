import { create } from "zustand";
import { api } from "@/http/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ loading }),

  checkAuth: async () => {
    try {
      // Call a protected endpoint to verify if user is authenticated
      const response = await api.get("/api/auth/me");
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    set({ user: response.data.user });
  },

  register: async (email: string, password: string, name?: string) => {
    const response = await api.post("/api/auth/register", {
      email,
      password,
      name,
    });
    set({ user: response.data.user });
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      set({ user: null });
    }
  },
}));

// Initialize auth check on store creation
useAuthStore.getState().checkAuth();

