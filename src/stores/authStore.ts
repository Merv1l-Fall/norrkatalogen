import { create } from "zustand";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/data/firebase";
import type { AuthState, AuthUser } from "@/types";

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user: AuthUser | null): void => set({ user }),
  setLoading: (loading: boolean): void => set({ loading }),
  logOut: async (): Promise<void> => {
    await signOut(auth);
    set({ user: null });
  },
}));

/**
 * Initialize auth state listener
 */
export const initAuth = (): void => {
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  onAuthStateChanged(auth, (user) => {
    setUser(user as AuthUser | null);
    setLoading(false);
  });
};

export default useAuthStore;
