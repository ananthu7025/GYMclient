import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { Gym, GymState } from "./interface";

const initialState: GymState = {
  gyms: [],
  gym: null, // Add a field to store the fetched gym by ID
  loading: false,
  error: null,
};

// Create the gym slice
const gymSlice = createSlice({
  name: "gyms",
  initialState,
  reducers: {
    fetchGymsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGymsSuccess(state, action: PayloadAction<Gym[]>) {
      state.gyms = action.payload; // Set fetched gyms
      state.loading = false; // Set loading to false
    },
    fetchGymsFailure(state, action: PayloadAction<string>) {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set error message
    },
    createGymStart(state) {
      state.loading = true; // Set loading state to true
      state.error = null; // Clear any previous error
    },
    // Reducers for fetching gym by ID
    fetchGymByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGymByIdSuccess(state, action: PayloadAction<Gym>) {
      state.gym = action.payload; // Set the fetched gym
      state.loading = false;
    },
    fetchGymByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    editGymStart(state) {
      state.loading = true;
      state.error = null;
    },
    editGymSuccess(state, action: PayloadAction<Gym>) {
      const index = state.gyms.findIndex((g) => g._id === action.payload._id);
      if (index !== -1) {
        state.gyms[index] = action.payload; // Update the gym in the state
      }
      state.loading = false;
    },
    editGymFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteGymStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteGymSuccess(state, action: PayloadAction<string>) {
      state.gyms = state.gyms.filter((gym) => gym._id !== action.payload);
      state.loading = false;
    },
    deleteGymFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the actions
export const {
  fetchGymsStart,
  fetchGymsSuccess,
  fetchGymsFailure,
  createGymStart,
  fetchGymByIdStart,
  fetchGymByIdSuccess,
  fetchGymByIdFailure,
  editGymStart,
  editGymSuccess,
  editGymFailure,
  deleteGymStart,
  deleteGymSuccess,
  deleteGymFailure,
} = gymSlice.actions;

// Async function to fetch gyms
export const fetchGyms = () => async (dispatch: AppDispatch) => {
  dispatch(fetchGymsStart());
  try {
    const response = await axiosClient.get(API_URLS.GYM_GET_ALL); // Call the API to get gyms
    dispatch(fetchGymsSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchGymsFailure(error.message));
  }
};

// Async function to create a gym
export const createGym =
  (newGym: Omit<Gym, "_id" | "createdAt" | "updatedAt">) =>
  async (dispatch: AppDispatch) => {
    dispatch(createGymStart());
    try {
      const response = await axiosClient.post(API_URLS.GYM_CREATE, newGym); // Call the API to create a new gym
      dispatch(fetchGyms()); // Re-fetch all gyms after creating one
      return response;
    } catch (error: any) {
      // Handle error (optional)
    }
  };

// Async function to fetch a gym by ID
export const getGymById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchGymByIdStart());
  try {
    const response = await axiosClient.get(`${API_URLS.GYM_GET_BY_ID}/${id}`);
    dispatch(fetchGymByIdSuccess(response.data)); // Pass the gym data to the reducer
    return response.data;
  } catch (error: any) {
    dispatch(fetchGymByIdFailure(error.message));
  }
};
// Async function to edit a gym by ID
export const editGym =
  (id: string, updatedGym: Partial<Gym>) => async (dispatch: AppDispatch) => {
    dispatch(editGymStart());
    try {
      const response = await axiosClient.put(
        `${API_URLS.GYM_EDIT}/${id}`,
        updatedGym
      );
      dispatch(fetchGyms()); // Optionally re-fetch the gyms
      return response.data;
    } catch (error: any) {
      dispatch(editGymFailure(error.message));
    }
  };
// Async function to delete a gym
export const deleteGym = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteGymStart());
  try {
    const response = await axiosClient.delete(`${API_URLS.GYM_DELETE}/${id}`);
    dispatch(deleteGymSuccess(id));
    return response;
  } catch (error: any) {
    dispatch(deleteGymFailure(error.message));
  }
};
export default gymSlice.reducer;
