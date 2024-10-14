import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import franchiseReducer from "../slices/franchiseSlice";
import gymReducer from "../slices/gymSlice";
import membershipReducer from "../slices/membershipSlice";
import trainerReducer from "../slices/trainerSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    franchises: franchiseReducer,
    gyms: gymReducer,
    memberships:membershipReducer,
    trainers:trainerReducer,

  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
