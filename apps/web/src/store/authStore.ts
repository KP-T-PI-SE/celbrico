import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  mobileNumber: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tempToken: string | null; // Used during OTP verification before PIN setup
  login: (user: User, token: string) => void;
  logout: () => void;
  setTempToken: (token: string) => void;
  clearTempToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tempToken: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, tempToken: null }),
      setTempToken: (token) => set({ tempToken: token }),
      clearTempToken: () => set({ tempToken: null }),
    }),
    {
      name: 'celbrico-auth',
    }
  )
);
