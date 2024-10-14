import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { Membership, MembershipState } from "./interface";

const initialState: MembershipState = {
  memberships: [], // List of memberships
  membership: null, // Single fetched membership by ID
  loading: false,
  error: null,
  suggestion:[],
};

// Create the membership slice
const membershipSlice = createSlice({
  name: "memberships",
  initialState,
  reducers: {
    // Fetch all memberships
    fetchMembershipsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMembershipsSuccess(state, action: PayloadAction<Membership[]>) {
      state.memberships = action.payload;
      state.loading = false;
    },
    setSuggestion(state, action: PayloadAction<Membership[]>) {
      state.suggestion = action.payload;
      state.loading = false;
    },
    fetchMembershipsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch membership by ID
    fetchMembershipByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMembershipByIdSuccess(state, action: PayloadAction<Membership>) {
      state.membership = action.payload;
      state.loading = false;
    },
    fetchMembershipByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Create a membership
    createMembershipStart(state) {
      state.loading = true;
      state.error = null;
    },
    createMembershipSuccess(state, action: PayloadAction<Membership>) {
      state.memberships.push(action.payload); // Add the new membership to the list
      state.loading = false;
    },
    createMembershipFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update membership
    updateMembershipStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateMembershipSuccess(state, action: PayloadAction<Membership>) {
      const index = state.memberships.findIndex(
        (m) => m._id === action.payload._id
      );
      if (index !== -1) {
        state.memberships[index] = action.payload; // Update membership in the list
      }
      state.loading = false;
    },
    updateMembershipFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
     // Bulk import memberships
     bulkImportMembershipsStart(state) {
      state.loading = true;
      state.error = null;
    },
    bulkImportMembershipsSuccess(state, action: PayloadAction<Membership[]>) {
      state.memberships.push(...action.payload); // Add the new memberships to the list
      state.loading = false;
    },
    bulkImportMembershipsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

// Export the actions
export const {
  fetchMembershipsStart,
  fetchMembershipsSuccess,
  fetchMembershipsFailure,
  fetchMembershipByIdStart,
  fetchMembershipByIdSuccess,
  fetchMembershipByIdFailure,
  createMembershipStart,
  createMembershipSuccess,
  createMembershipFailure,
  updateMembershipStart,
  updateMembershipSuccess,
  updateMembershipFailure,
  setSuggestion,
  bulkImportMembershipsStart,
  bulkImportMembershipsSuccess,
  bulkImportMembershipsFailure,
} = membershipSlice.actions;

// Async thunk to fetch all memberships
export const fetchMemberships = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.get(API_URLS.MEMBERSHIP_GET_ALL);
    dispatch(fetchMembershipsSuccess(response.data));
    dispatch(setSuggestion(response?.data?.suggestions));
  } catch (error: any) {
    dispatch(fetchMembershipsFailure(error.message));
  }
};

// Async thunk to fetch a membership by ID
export const fetchMembershipById =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchMembershipByIdStart());
    try {
      const response = await axiosClient.get(`${API_URLS.MEMBERSHIP_GET_BY_ID}/${id}`);
      dispatch(fetchMembershipByIdSuccess(response.data));
      return response.data;
    } catch (error: any) {
      dispatch(fetchMembershipByIdFailure(error.message));
    }
  };

// Async thunk to create a membership
export const createMembership =
  (newMembership: Omit<Membership, "_id" | "createdAt" | "updatedAt">) =>
  async (dispatch: AppDispatch) => {
    dispatch(createMembershipStart());
    try {
      const response = await axiosClient.post(API_URLS.MEMBERSHIP_CREATE, newMembership);
      dispatch(createMembershipSuccess(response.data));
      return response.data;

    } catch (error: any) {
      dispatch(createMembershipFailure(error.message));
    }
  };

// Async thunk to update a membership by ID
export const updateMembership =
  (id: string, updatedMembership: Partial<Membership>) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateMembershipStart());
    try {
      const response = await axiosClient.put(`${API_URLS.MEMBERSHIP_UPDATE}/${id}`, updatedMembership);
      dispatch(updateMembershipSuccess(response.data));
      return response.data;
    } catch (error: any) {
      dispatch(updateMembershipFailure(error.message));
    }
  };

  export const bulkImportMemberships =(memberships:any) =>async (dispatch: any) => {
    try {
      const response = await axiosClient.post(API_URLS.MEMBERSHIP_IMPORT, memberships);
      dispatch(fetchMemberships())
      return response.data;
    } catch (error: any) {
     console.log(error)
    }
  };

export default membershipSlice.reducer;
