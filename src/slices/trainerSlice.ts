import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { Trainer, TrainerState } from "./interface";

const initialState: TrainerState = {
  trainers: [],
  trainer: null, // Store fetched trainer by ID
  loading: false,
  error: null,
};

// Create the trainer slice
const trainerSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {
    fetchTrainersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTrainersSuccess(state, action: PayloadAction<Trainer[]>) {
      state.trainers = action.payload; // Set fetched trainers
      state.loading = false; // Stop loading
    },
    fetchTrainersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload; // Set error message
    },
    createTrainerStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTrainerByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTrainerByIdSuccess(state, action: PayloadAction<Trainer>) {
      state.trainer = action.payload; // Set fetched trainer by ID
      state.loading = false;
    },
    fetchTrainerByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    editTrainerStart(state) {
      state.loading = true;
      state.error = null;
    },
    editTrainerSuccess(state, action: PayloadAction<Trainer>) {
      const index = state.trainers.findIndex(
        (t) => t._id === action.payload._id
      );
      if (index !== -1) {
        state.trainers[index] = action.payload; // Update trainer in the state
      }
      state.loading = false;
    },
    editTrainerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTrainerStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteTrainerSuccess(state, action: PayloadAction<string>) {
      state.trainers = state.trainers.filter(
        (trainer) => trainer._id !== action.payload
      );
      state.loading = false;
    },
    deleteTrainerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the actions
export const {
  fetchTrainersStart,
  fetchTrainersSuccess,
  fetchTrainersFailure,
  createTrainerStart,
  fetchTrainerByIdStart,
  fetchTrainerByIdSuccess,
  fetchTrainerByIdFailure,
  editTrainerStart,
  editTrainerSuccess,
  editTrainerFailure,
  deleteTrainerStart,
  deleteTrainerSuccess,
  deleteTrainerFailure,
} = trainerSlice.actions;

// Async function to fetch trainers
export const fetchTrainers = () => async (dispatch: AppDispatch) => {
  dispatch(fetchTrainersStart());
  try {
    const response = await axiosClient.get(API_URLS.TRAINER_GET_ALL); // Adjust API URL
    dispatch(fetchTrainersSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchTrainersFailure(error.message));
  }
};

// Async function to create a trainer
export const createTrainer =
  (newTrainer: Omit<Trainer, "_id" | "createdAt" | "updatedAt">) =>
  async (dispatch: AppDispatch) => {
    dispatch(createTrainerStart());
    try {
      const response = await axiosClient.post(API_URLS.TRAINER_CREATE, newTrainer); // Adjust API URL
      dispatch(fetchTrainers()); // Optionally re-fetch trainers
      return response.data;
    } catch (error: any) {
      // Handle error (optional)
    }
  };

// Async function to fetch a trainer by ID
export const getTrainerById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchTrainerByIdStart());
  try {
    const response = await axiosClient.get(
      `${API_URLS.TRAINER_GET_BY_ID}/${id}`
    );
    dispatch(fetchTrainerByIdSuccess(response.data)); // Pass trainer data to reducer
    return response.data;
  } catch (error: any) {
    dispatch(fetchTrainerByIdFailure(error.message));
  }
};

// Async function to edit a trainer by ID
export const editTrainer =
  (id: string, updatedTrainer: Partial<Trainer>) =>
  async (dispatch: AppDispatch) => {
    dispatch(editTrainerStart());
    try {
      const response = await axiosClient.put(
        `${API_URLS.TRAINER_EDIT}/${id}`,
        updatedTrainer
      );
      dispatch(fetchTrainers()); // Optionally re-fetch trainers
      return response.data;
    } catch (error: any) {
      dispatch(editTrainerFailure(error.message));
    }
  };

// Async function to delete a trainer
export const deleteTrainer = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteTrainerStart());
  try {
    const response = await axiosClient.delete(
      `${API_URLS.TRAINER_DELETE}/${id}`
    );
    dispatch(deleteTrainerSuccess(id));
    return response;
  } catch (error: any) {
    dispatch(deleteTrainerFailure(error.message));
  }
};

export default trainerSlice.reducer;
