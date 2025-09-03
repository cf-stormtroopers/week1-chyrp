import { create } from "zustand";
import type { UserRead } from "../api/generated";

export interface AuthState {
  blogTitle: string;
  extensions: string[];
  loggedIn: boolean;
  accountInformation: UserRead | null;

  setBlogTitle: (title: string) => void;
  addExtension: (ext: string) => void;
  removeExtension: (ext: string) => void;
  clearExtensions: () => void;
  setLoggedIn: (status: boolean) => void;
  setAccountInformation: (info: UserRead | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  blogTitle: "",
  extensions: [],
  loggedIn: false,
  accountInformation: null,

  setBlogTitle: (title) => set({ blogTitle: title }),
  addExtension: (ext) =>
    set((state) => ({
      extensions: state.extensions.includes(ext)
        ? state.extensions
        : [...state.extensions, ext],
    })),
  removeExtension: (ext) =>
    set((state) => ({
      extensions: state.extensions.filter((e) => e !== ext),
    })),
  clearExtensions: () => set({ extensions: [] }),
  setLoggedIn: (status) => set({ loggedIn: status }),
  setAccountInformation: (info) => set({ accountInformation: info }),

  reset: () =>
    set({
      blogTitle: "",
      extensions: [],
      loggedIn: false,
      accountInformation: null,
    }),
}));
