import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
  name?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface AuthState {
  user: UserData | null;
}

// 2. Səhifə yenilənəndə məlumatlar itməsin deyə localStorage-dan ilkin dəyəri oxuyuruq
const getInitialUser = (): UserData | null => {
  try {
    const savedUser = localStorage.getItem("user") || localStorage.getItem("userData");
    return savedUser ? (JSON.parse(savedUser) as UserData) : null;
  } catch (error) {
    console.error("LocalStorage-dan istifadəçi məlumatı oxunarkən xəta:", error);
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
};

// 3. Slice-ı yaradırıq
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Giriş edəndə və ya istifadəçi yenilənəndə bu funksiyanı çağıracağıq
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    // Çıxış edəndə state-i sıfırlamaq üçün
    clearUser: (state) => {
      state.user = null;
    },
  },
});

// Komponentlərdə (məsələn MainLayout-da) istifadə etmək üçün aksiyaları ixrac edirik
export const { setUser, clearUser } = authSlice.actions;

// Store-a qeydiyyatdan keçirmək üçün reducer-i ixrac edirik
export default authSlice.reducer;