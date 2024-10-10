import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import franchiseReducer from "../slices/franchiseSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    franchises: franchiseReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
