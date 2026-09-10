import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  mobileNumber: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin' | string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tempToken: string | null; // Used during OTP verification before PIN setup
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
  setTempToken: (token: string) => void;
  clearTempToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tempToken: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, tempToken: null }),
      updateUser: (fields) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...fields } });
        }
      },
      setTempToken: (token) => set({ tempToken: token }),
      clearTempToken: () => set({ tempToken: null }),
    }),
    {
      name: 'celbrico-auth',
    }
  )
);
