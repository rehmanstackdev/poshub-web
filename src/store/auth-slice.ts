import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/lib/types";

const TOKEN_KEY = "poshub_token";
const USER_KEY = "poshub_user";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  hydrated: false,
};

function writeCookie(token: string | null) {
  if (typeof document === "undefined") return;
  document.cookie = token
    ? `${TOKEN_KEY}=${token}; Path=/; SameSite=Lax; Max-Age=86400`
    : `${TOKEN_KEY}=; Path=/; SameSite=Lax; Max-Age=0`;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateFromStorage(state) {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem(TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY);
      state.token = token;
      state.user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
      state.hydrated = true;
      writeCookie(token);
    },
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      }
      writeCookie(action.payload.token);
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      }
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      writeCookie(null);
    },
  },
});

export const { hydrateFromStorage, setCredentials, setUser, clearCredentials } =
  authSlice.actions;
export default authSlice.reducer;
