// Custom cookie utilities that are SSR-safe
export const cookies = {
  get: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },
  
  set: (name: string, value: string, days: number = 7): void => {
    if (typeof window === "undefined") return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },
  
  remove: (name: string): void => {
    if (typeof window === "undefined") return;
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  },
};