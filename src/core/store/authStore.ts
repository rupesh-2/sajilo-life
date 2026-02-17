// src/app/store/authStore.ts
import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { User } from "firebase/auth";

const storage = new MMKV();

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: User, token: string) => void;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: storage.getString("token") || null,
    get isAuthenticated() {
        return !!get().token;
    },
    setUser: (user, token) => {
        set({ user, token });
     