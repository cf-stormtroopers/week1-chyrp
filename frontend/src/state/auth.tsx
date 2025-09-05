import { create } from "zustand";
import { logoutAuthLogoutPost, useLogoutAuthLogoutPost, type UserRead } from "../api/generated";

export interface Extensions {
  likes: boolean
  views: boolean
  comments: boolean
  tags: boolean
}

const EmptyExtensions = {
  likes: false,
  comments: false,
  views: false,
  tags: false
}

export interface AuthState {
  blogTitle: string;
  extensions: Extensions;
  loggedIn: boolean;
  accountInformation: UserRead | null;

  setBlogTitle: (title: string) => void;
  setExtensions: (extensions: Extensions) => void;
  setLoggedIn: (status: boolean) => void;
  setAccountInformation: (info: UserRead | null) => void;
  reset: () => void;

  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  blogTitle: "",
  extensions: EmptyExtensions,
  loggedIn: false,
  accountInformation: null,

  setBlogTitle: (title) => set({ blogTitle: title }),
  setExtensions: (exts: Extensions) => {
    set({ extensions: exts });
  },
  setLoggedIn: (status) => set({ loggedIn: status }),
  setAccountInformation: (info) => set({ accountInformation: info }),

  reset: () =>
    set({
      blogTitle: "",
      extensions: EmptyExtensions,
      loggedIn: false,
      accountInformation: null,
    }),

  logout: async () => {
    await logoutAuthLogoutPost()
    set({
      accountInformation: null,
      loggedIn: false
    })
  }
}));
