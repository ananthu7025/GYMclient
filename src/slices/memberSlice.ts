import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";
import axiosClient from "../api/axios.client";
import { API_URLS } from "../api/urls";
import { Member, MemberState } from "./interface";

const initialState: MemberState = {
  members: [],
  member: null, // Store fetched member by ID
  loading: false,
  error: null,
};

// Create the member slice
const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    fetchMembersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMembersSuccess(state, action: PayloadAction<Member[]>) {
      state.members = action.payload; // Set fetched members
      state.loading = false; // Stop loading
    },
    fetchMembersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload; // Set error message
    },
    createMemberStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMemberByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMemberByIdSuccess(state, action: PayloadAction<Member>) {
      state.member = action.payload; // Set fetched member by ID
      state.loading = false;
    },
    fetchMemberByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    editMemberStart(state) {
      state.loading = true;
      state.error = null;
    },
    editMemberFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteMemberStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteMemberFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the actions
export const {
  fetchMembersStart,
  fetchMembersSuccess,
  fetchMembersFailure,
  createMemberStart,
  fetchMemberByIdStart,
  fetchMemberByIdSuccess,
  fetchMemberByIdFailure,
  editMemberStart,
  editMemberFailure,
  deleteMemberStart,
  deleteMemberFailure,
} = memberSlice.actions;

// Async function to fetch members
export const fetchMembers = () => async (dispatch: AppDispatch) => {
  dispatch(fetchMembersStart());
  try {
    const response = await axiosClient.get(API_URLS.MEMBER_GET_ALL); // Adjust API URL for members
    dispatch(fetchMembersSuccess(response.data.members));
  } catch (error: any) {
    dispatch(fetchMembersFailure(error.message));
  }
};

// Async function to create a member
export const createMember =
  (newMember: Omit<Member, "_id" | "createdAt" | "updatedAt">) =>
  async (dispatch: AppDispatch) => {
    dispatch(createMemberStart());
    try {
      const response = await axiosClient.post(API_URLS.MEMBER_CREATE, newMember); // Adjust API URL
      dispatch(fetchMembers()); // Optionally re-fetch members
      return response.data;
    } catch (error: any) {
      // Handle error (optional)
    }
  };

// Async function to fetch a member by ID
export const getMemberById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchMemberByIdStart());
  try {
    const response = await axiosClient.get(`${API_URLS.MEMBER_GET_BY_ID}/${id}`);
    dispatch(fetchMemberByIdSuccess(response.data)); // Pass member data to reducer
    return response.data;
  } catch (error: any) {
    dispatch(fetchMemberByIdFailure(error.message));
  }
};

// Async function to edit a member by ID
export const editMember =
  (id: string, updatedMember: Partial<Member>) =>
  async (dispatch: AppDispatch) => {
    dispatch(editMemberStart());
    try {
      const response = await axiosClient.put(
        `${API_URLS.MEMBER_EDIT}/${id}`,
        updatedMember
      );
      dispatch(fetchMembers()); // Optionally re-fetch members
      return response.data;
    } catch (error: any) {
      dispatch(editMemberFailure(error.message));
    }
  };

// Async function to delete a member
export const deleteMember = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteMemberStart());
  try {
    const response = await axiosClient.delete(`${API_URLS.MEMBER_DELETE}/${id}`);
    return response;
  } catch (error: any) {
    dispatch(deleteMemberFailure(error.message));
  }
};

export default memberSlice.reducer;
