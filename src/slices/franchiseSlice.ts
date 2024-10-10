import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { Franchise, FranchiseState } from "./interface";

const initialState: FranchiseState = {
  franchises: [],
  franchise: null, // Add a field to store the fetched franchise by ID
  loading: false,
  error: null,
};

// Create the franchise slice
const franchiseSlice = createSlice({
  name: "franchises",
  initialState,
  reducers: {
    fetchFranchisesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFranchisesSuccess(state, action: PayloadAction<Franchise[]>) {
      state.franchises = action.payload; // Set fetched franchises
      state.loading = false; // Set loading to false
    },
    fetchFranchisesFailure(state, action: PayloadAction<string>) {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set error message
    },
    createFranchiseStart(state) {
      state.loading = true; // Set loading state to true
      state.error = null; // Clear any previous error
    },
    // Reducers for fetching franchise by ID
    fetchFranchiseByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFranchiseByIdSuccess(state, action: PayloadAction<Franchise>) {
      state.franchise = action.payload; // Set the fetched franchise
      state.loading = false;
    },
    fetchFranchiseByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    editFranchiseStart(state) {
      state.loading = true;
      state.error = null;
    },
    editFranchiseSuccess(state, action: PayloadAction<Franchise>) {
      const index = state.franchises.findIndex(
        (f) => f._id === action.payload._id
      );
      if (index !== -1) {
        state.franchises[index] = action.payload; // Update the franchise in the state
      }
      state.loading = false;
    },
    editFranchiseFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteFranchiseStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteFranchiseSuccess(state, action: PayloadAction<string>) {
      state.franchises = state.franchises.filter(
        (franchise) => franchise._id !== action.payload
      );
      state.loading = false;
    },
    deleteFranchiseFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the actions
export const {
  fetchFranchisesStart,
  fetchFranchisesSuccess,
  fetchFranchisesFailure,
  createFranchiseStart,
  fetchFranchiseByIdStart,
  fetchFranchiseByIdSuccess,
  fetchFranchiseByIdFailure,
  editFranchiseStart,
  editFranchiseSuccess,
  editFranchiseFailure,
  deleteFranchiseStart,
  deleteFranchiseSuccess,
  deleteFranchiseFailure,
} = franchiseSlice.actions;

// Async function to fetch franchises
export const fetchFranchises = () => async (dispatch: AppDispatch) => {
  dispatch(fetchFranchisesStart());
  try {
    const response = await axiosClient.get(API_URLS.FRANCHISE_GET_ALL); // Call the API to get franchises
    dispatch(fetchFranchisesSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchFranchisesFailure(error.message));
  }
};

// Async function to create a franchise
export const createFranchise =
  (newFranchise: Omit<Franchise, "_id" | "createdAt" | "updatedAt">) =>
  async (dispatch: AppDispatch) => {
    dispatch(createFranchiseStart());
    try {
      const response = await axiosClient.post(
        API_URLS.FRANCHISE_CREATE,
        newFranchise
      ); // Call the API to create a new franchise
      dispatch(fetchFranchises()); // Re-fetch all franchises after creating one
      return response;
    } catch (error: any) {
      // Handle error (optional)
    }
  };

// Async function to fetch a franchise by ID
export const getFranchiseById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchFranchiseByIdStart());
    try {
      const response = await axiosClient.get(
        `${API_URLS.FRANCHISE_GET_BY_ID}/${id}`
      );
      dispatch(fetchFranchiseByIdSuccess(response.data)); // Pass the franchise data to the reducer
      return response.data;
    } catch (error: any) {
      dispatch(fetchFranchiseByIdFailure(error.message));
    }
  };
// Async function to edit a franchise by ID
export const editFranchise =
  (id: string, updatedFranchise: Partial<Franchise>) =>
  async (dispatch: AppDispatch) => {
    dispatch(editFranchiseStart());
    try {
      const response = await axiosClient.put(
        `${API_URLS.FRANCHISE_EDIT}/${id}`,
        updatedFranchise
      );
      dispatch(fetchFranchises()); // Optionally re-fetch the franchises
      return response.data;
    } catch (error: any) {
      dispatch(editFranchiseFailure(error.message));
    }
  };
// Async function to delete a franchise
export const deleteFranchise =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(deleteFranchiseStart());
    try {
      const response = await axiosClient.delete(
        `${API_URLS.FRANCHISE_DELETE}/${id}`
      );
      dispatch(deleteFranchiseSuccess(id));
      return response;
    } catch (error: any) {
      dispatch(deleteFranchiseFailure(error.message));
    }
  };
export default franchiseSlice.reducer;
