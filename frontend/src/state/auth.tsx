import { create } from "zustand";
import { logoutAuthLogoutPost, useLogoutAuthLogoutPost, type SiteInfoResponseSettings, type UserRead } from "../api/generated";
import { mutate } from "swr";

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

export interface Settings {
  show_search: boolean
  show_markdown: boolean
  show_registration: boolean
}

const EmptySettings = {
  show_search: false,
  show_markdown: false,
  show_registration: false
}

export interface AuthState {
  blogTitle: string;
  extensions: Extensions;
  loggedIn: boolean;
  accountInformation: UserRead | null;
  settings: Settings;

  setBlogTitle: (title: string) => void;
  setExtensions: (extensions: Extensions) => void;
  setLoggedIn: (status: boolean) => void;
  setAccountInformation: (info: UserRead | null) => void;
  setSettings: (settings: Settings) => void;
  reset: () => void;

  logout: () => Promise<void>
  mutate: () => void
  setMutate: (mutate: () => void) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  blogTitle: "",
  extensions: EmptyExtensions,
  loggedIn: false,
  accountInformation: null,
  settings: EmptySettings,

  setBlogTitle: (title) => set({ blogTitle: title }),
  setExtensions: (exts: Extensions) => {
    set({ extensions: exts });
  },
  setLoggedIn: (status) => set({ loggedIn: status }),
  setAccountInformation: (info) => set({ accountInformation: info }),
  setSettings: (settings) => set({ settings: settings }),

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
  },

  mutate: () => mutate("/site/info"),
  setMutate: (mutate) => set({ mutate }),
}));
