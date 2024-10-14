import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { trackPromise } from "react-promise-tracker";
import toaster from "../utils/toaster";

interface UserDetails {
  id: string; // The user ID, a string
  name: string; // The user's name
  email: string; // The user's email
  role: number; // The user's role, represented as a number (1 for Admin)
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userDetails: UserDetails | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  userDetails: null, // Add this field for user details
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("token", action.payload);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.userDetails = null;
      localStorage.removeItem("token");
    },
    setUserDetails(state, action: PayloadAction<UserDetails>) {
      state.userDetails = action.payload;
    },
  },
});

export const { loginSuccess, loginFailure, logout, setUserDetails } =
  authSlice.actions;

// Async function to login
export const login =
  (credentials: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await trackPromise(
        axiosClient.post(API_URLS.LOGIN, credentials)
      ); // Use trackPromise
      dispatch(loginSuccess(response.data.token));
      localStorage.setItem("token", response.data.token); // Get token from localStorage

      // Fetch user details after successful login
      await dispatch<any>(getUserDetails());
      return response;
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      localStorage.clear();
      toaster.error("Login Failed please try again");
      console.log(error);
    }
  };

// Async function to get user details
export const getUserDetails =
  () => async (dispatch: AppDispatch, getState: () => AuthState) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    console.log(token, "token");
    if (token) {
      try {
        const response = await trackPromise(
          axiosClient.get(API_URLS.USER_DETAILS, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        dispatch(setUserDetails(response.data)); // Set user details
      } catch (error: any) {
        dispatch(loginFailure(error.message));
        localStorage.clear();
        window.location.href = "/";
      }
    }
  };

export default authSlice.reducer;
