import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { Workout, WorkoutState } from "./interface";

// Initial state for the workout slice
const initialState: WorkoutState = {
  workouts: [],
  workout: null, // Add a field to store a single fetched workout by ID
  loading: false,
  error: null,
};

// Create the workout slice
const workoutSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    fetchWorkoutsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWorkoutsSuccess(state, action: PayloadAction<any[]>) {
      state.workouts = action.payload; // Set fetched workouts
      state.loading = false;
    },
    fetchWorkoutsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload; // Set error message
    },
    fetchWorkoutByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWorkoutByIdSuccess(state, action: PayloadAction<Workout>) {
      state.workout = action.payload; // Set the fetched workout
      state.loading = false;
    },
    fetchWorkoutByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createWorkoutStart(state) {
      state.loading = true;
      state.error = null;
    },
    createWorkoutSuccess(state, action: PayloadAction<Workout>) {
      state.workouts.push(action.payload); // Add the new workout to the list
      state.loading = false;
    },
    createWorkoutFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    editWorkoutStart(state) {
      state.loading = true;
      state.error = null;
    },
    editWorkoutFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteWorkoutStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteWorkoutSuccess(state, action: PayloadAction<string>) {
      state.workouts = state.workouts.filter(
        (workout:any) => workout._id !== action.payload
      );
      state.loading = false;
    },
    deleteWorkoutFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the actions
export const {
  fetchWorkoutsStart,
  fetchWorkoutsSuccess,
  fetchWorkoutsFailure,
  fetchWorkoutByIdStart,
  fetchWorkoutByIdSuccess,
  fetchWorkoutByIdFailure,
  createWorkoutStart,
  createWorkoutSuccess,
  createWorkoutFailure,
  editWorkoutStart,
  editWorkoutFailure,
  deleteWorkoutStart,
  deleteWorkoutSuccess,
  deleteWorkoutFailure,
} = workoutSlice.actions;

// Async function to fetch workouts
export const fetchWorkouts = () => async (dispatch: AppDispatch) => {
  dispatch(fetchWorkoutsStart());
  try {
    const response = await axiosClient.get(API_URLS.WORKOUT_GET_ALL); // API call to get all workouts
    console.log(response.data)
    return response.data
  } catch (error: any) {
    dispatch(fetchWorkoutsFailure(error.message));
  }
};

// Async function to create a new workout
export const createWorkout =
  (newWorkout: any) =>
  async (dispatch: AppDispatch) => {
    dispatch(createWorkoutStart());
    try {
      const response = await axiosClient.post(
        API_URLS.WORKOUT_CREATE,
        newWorkout
      );
      dispatch(createWorkoutSuccess(response.data));
      return response;
    } catch (error: any) {
      dispatch(createWorkoutFailure(error.message));
    }
  };

// Async function to fetch a workout by ID
export const getWorkoutById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchWorkoutByIdStart());
  try {
    const response = await axiosClient.get(`${API_URLS.WORKOUT_GET_BY_ID}/${id}`);
    dispatch(fetchWorkoutByIdSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchWorkoutByIdFailure(error.message));
  }
};

// Async function to edit a workout by ID
export const editWorkout =
  (id: string, updatedWorkout: Partial<any>) =>
  async (dispatch: AppDispatch) => {
    dispatch(editWorkoutStart());
    try {
      const response = await axiosClient.put(
        `${API_URLS.WORKOUT_EDIT}/${id}`,
        updatedWorkout
      );
      return response.data;
    } catch (error: any) {
      dispatch(editWorkoutFailure(error.message));
    }
  };

// Async function to delete a workout by ID
export const deleteWorkout = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteWorkoutStart());
  try {
    const response = await axiosClient.delete(`${API_URLS.WORKOUT_DELETE}/${id}`);
    dispatch(deleteWorkoutSuccess(id));
    return response;
  } catch (error: any) {
    dispatch(deleteWorkoutFailure(error.message));
  }
};

export default workoutSlice.reducer;
