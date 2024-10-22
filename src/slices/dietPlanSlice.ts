import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { DietPlan, DietPlanState } from "./interface"; // Update your interface imports accordingly

// Initial state for the diet plan slice
const initialState: DietPlanState = {
  dietPlans: [],
  dietPlan: null,
  loading: false,
  error: null,
};

// Create the diet plan slice
const dietPlanSlice = createSlice({
  name: "dietPlans",
  initialState,
  reducers: {
    fetchDietPlansStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDietPlansSuccess(state, action: PayloadAction<any[]>) {
      state.dietPlans = action.payload; // Set fetched diet plans
      state.loading = false;
    },
    fetchDietPlansFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload; // Set error message
    },
    fetchDietPlanByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDietPlanByIdSuccess(state, action: PayloadAction<DietPlan>) {
      state.dietPlan = action.payload; // Set the fetched diet plan
      state.loading = false;
    },
    fetchDietPlanByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createDietPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    createDietPlanSuccess(state, action: PayloadAction<DietPlan>) {
      state.dietPlans.push(action.payload); // Add the new diet plan to the list
      state.loading = false;
    },
    createDietPlanFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    editDietPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    editDietPlanFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteDietPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteDietPlanSuccess(state, action: PayloadAction<string>) {
      state.dietPlans = state.dietPlans.filter(
        (dietPlan: any) => dietPlan._id !== action.payload
      );
      state.loading = false;
    },
    deleteDietPlanFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // New reducers for assigning a diet plan
    assignDietPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    assignDietPlanSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.dietPlan = action.payload; // Optionally store the assigned diet plan
    },
    assignDietPlanFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the actions
export const {
  fetchDietPlansStart,
  fetchDietPlansSuccess,
  fetchDietPlansFailure,
  fetchDietPlanByIdStart,
  fetchDietPlanByIdSuccess,
  fetchDietPlanByIdFailure,
  createDietPlanStart,
  createDietPlanSuccess,
  createDietPlanFailure,
  editDietPlanStart,
  editDietPlanFailure,
  deleteDietPlanStart,
  deleteDietPlanSuccess,
  deleteDietPlanFailure,
  assignDietPlanStart,
  assignDietPlanSuccess,
  assignDietPlanFailure,
} = dietPlanSlice.actions;

// Async function to fetch diet plans
export const fetchDietPlans = () => async (dispatch: AppDispatch) => {
  dispatch(fetchDietPlansStart());
  try {
    const response = await axiosClient.get(API_URLS.DIET_PLAN_GET_ALL);
    console.log(response.data);
    dispatch(fetchDietPlansSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchDietPlansFailure(error.message));
  }
};

// Async function to create a new diet plan
export const createDietPlan = (newDietPlan: any) => async (dispatch: AppDispatch) => {
  dispatch(createDietPlanStart());
  try {
    const response = await axiosClient.post(API_URLS.DIET_PLAN_CREATE, newDietPlan);
    dispatch(createDietPlanSuccess(response.data));
    return response;
  } catch (error: any) {
    dispatch(createDietPlanFailure(error.message));
  }
};

// Async function to fetch a diet plan by ID
export const getDietPlanById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchDietPlanByIdStart());
  try {
    const response = await axiosClient.get(`${API_URLS.DIET_PLAN_GET_BY_ID}/${id}`);
    dispatch(fetchDietPlanByIdSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchDietPlanByIdFailure(error.message));
  }
};

// Async function to edit a diet plan by ID
export const editDietPlan = (id: string, updatedDietPlan: Partial<any>) => async (dispatch: AppDispatch) => {
  dispatch(editDietPlanStart());
  try {
    const response = await axiosClient.put(`${API_URLS.DIET_PLAN_EDIT}/${id}`, updatedDietPlan);
    return response.data;
  } catch (error: any) {
    dispatch(editDietPlanFailure(error.message));
  }
};

// Async function to delete a diet plan by ID
export const deleteDietPlan = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteDietPlanStart());
  try {
    const response = await axiosClient.delete(`${API_URLS.DIET_PLAN_DELETE}/${id}`);
    dispatch(deleteDietPlanSuccess(id));
    return response;
  } catch (error: any) {
    dispatch(deleteDietPlanFailure(error.message));
  }
};

// Async function to assign a diet plan to a member
export const assignDietPlanToMember = (memberId: string, dietPlanId: string) => async (dispatch: AppDispatch) => {
  dispatch(assignDietPlanStart());
  try {
    const response = await axiosClient.post(API_URLS.ASSIGN_DIET_PLAN, { memberId, dietPlanId });
    dispatch(assignDietPlanSuccess(response.data)); // Optionally set any response data
    return response;
  } catch (error: any) {
    dispatch(assignDietPlanFailure(error.message));
  }
};

export default dietPlanSlice.reducer;
