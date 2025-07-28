
import { create } from "zustand";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../data/firebase";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logOut: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

// Initialize auth state listener
export const initAuth = () => {
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });
};

export default useAuthStore;
