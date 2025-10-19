import { create } from "zustand";
import { login as loginApi, register as registerApi, logout as logoutApi, checkAuth as checkAuthApi } from "@/http/api";

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
      const response = await checkAuthApi();
      set({ user: response.data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    const response = await loginApi(email, password);
    set({ user: response.data.user });
  },

  register: async (email: string, password: string, name?: string) => {
    const response = await registerApi(email, password, name);
    set({ user: response.data.user });
  },

  logout: async () => {
    try {
      await logoutApi();
    } finally {
      set({ user: null });
    }
  },
}));

// Initialize auth check on store creation
useAuthStore.getState().checkAuth();

