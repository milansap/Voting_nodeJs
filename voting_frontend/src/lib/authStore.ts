import { create } from "zustand";
import { cookies } from "./cookies";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setToken: (token: string | null, expiryInHours?: number) => void;
  setAdmin: (isAdmin: boolean) => void;
  removeToken: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  const initToken = cookies.get("token");
  const initAdmin = cookies.get("admin");

  const isLoggedIn = !!initToken;

  const hasAdminRole = initAdmin === "true";

  return {
    token: initToken || null,
    isLoggedIn: isLoggedIn,
    isAdmin: hasAdminRole,

    setToken: (token, expiryInHours = 12) => {
      if (token) {
        cookies.set("token", token, expiryInHours / 24); // Convert hours to days
        set({ token: token, isLoggedIn: true });
      } else {
        cookies.remove("token");
        set({ token: null, isLoggedIn: false });
      }
    },
    setAdmin: (isAdmin) => {
      cookies.set("admin", isAdmin.toString());
      if (isAdmin) {
        cookies.remove("manager");
      }
      set({ isAdmin: isAdmin });
    },
    removeToken: () => {
      cookies.remove("token");
      cookies.remove("admin");
      set({
        token: null,
        isLoggedIn: false,
        isAdmin: false,
      });
    },
  };
});

export { useAuthStore };
