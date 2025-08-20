import Cookies from "js-cookie";
import {create} from "zustand";

const initToken = Cookies.get("token") || null;
const initAdmin = Cookies.get("admin") === "true"; 
const isLoggedIn = !!initToken;

const useAuthStore = create((set) => ({
  token: initToken,
  isLoggedIn: isLoggedIn,
  isAdmin: initAdmin, 
  
  setToken: (token:string) => {
    if (token) {
      Cookies.set("token", token);
      set({ token: token, isLoggedIn: true });
    } else {
      Cookies.remove("token");
      set({ token: null, isLoggedIn: false });
    }
  },
  
  setAdmin: (isAdmin:boolean) => {
    Cookies.set("admin", isAdmin.toString()); 
    set({ isAdmin: isAdmin });
  },
  
  removeToken: () => {
    Cookies.remove("token");
    Cookies.remove("admin");
    set({ 
      token: null, 
      isLoggedIn: false,
      isAdmin: false 
    });
  },
}));

export { useAuthStore };