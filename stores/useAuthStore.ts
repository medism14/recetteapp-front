/** @format */

import { defineStore } from "#build/imports";
import type { User } from "~/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isAuthLoading: false
  }),

  actions: {
    setUser(user: any) {
      this.user = user;
      this.isAuthenticated = true;
      this.isAuthLoading = false;
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      this.isAuthLoading = false;
    },

    startAuthLoading() {
      this.isAuthLoading = true;
    },

    stopAuthLoading() {
      this.isAuthLoading = false;
    }
  },

  getters: {
    fullName: (state) =>
      state.user ? `${state.user.firstName} ${state.user.lastName}` : "",
    email: (state) => (state.user ? state.user.email : ""),
  },
});
