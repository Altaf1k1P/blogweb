import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../helper/axiosInstance";

// Async Thunks

// Login action
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", credentials);
      return response.data; // Assuming response contains user data
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Signup action
export const createAccount = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Signup failed";
      return rejectWithValue(message);
    }
  }
);

// Logout action
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("accessToken"); // Clear the token on logout
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/auth/current-user");
      return response.data;
    } catch (error) {
      return rejectWithValue("Fetching user failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Handle Signup
      .addCase(createAccount.fulfilled, (state) => {
        state.error = null; // Clear error (if any) on successful signup
      })

      // Handle Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })

      // Fetch Current User
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isAuthenticated = !!payload; // Mark authenticated if payload exists
      })

      // Catch All Rejected Cases
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        }
      );
  },
});

export default authSlice.reducer;
