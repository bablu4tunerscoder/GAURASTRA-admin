// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

// ------------------------------------------------
// RTK QUERY API
// ------------------------------------------------
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Users", "SingleUser"],

  endpoints: (builder) => ({
    // ---------------- LOGIN ----------------
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/api/auth/allLogins",
        method: "POST",
        body: data,
      }),

      transformResponse: (response) => {
        toast.success(response.message || "Login successful!");

        // save token
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);

        return response;
      },
    }),

    // ---------------- GET ALL USERS ----------------
    getAllUsers: builder.query({
      query: () => "/api/auth/users",
      providesTags: ["Users"],
    }),

    // ---------------- GET USER BY ID ----------------
    getUserById: builder.query({
      query: (id) => `/api/auth/users/${id}`,
      providesTags: ["SingleUser"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} = userApi;

// ------------------------------------------------
// NORMAL REDUX SLICE (User state, logout etc.)
// ------------------------------------------------
const initialState = {
  userData: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  allUsers: [],
  singleUser: null,

  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    logout: (state) => {
      state.userData = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
    },
  },

  // ------------------------------------------------
  // EXTRA REDUCERS — handling RTK Query responses
  // ------------------------------------------------
  extraReducers: (builder) => {
    // ---------------- LOGIN ----------------
    builder
      .addMatcher(userApi.endpoints.loginUser.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {

          state.isLoading = false;
          state.userData = payload.data;
          state.token = payload.data.token;
        }
      )
      .addMatcher(
        userApi.endpoints.loginUser.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error?.data?.message || "Login failed";
        }
      );

    // ---------------- GET ALL USERS ----------------
    builder
      .addMatcher(userApi.endpoints.getAllUsers.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.getAllUsers.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.allUsers = payload || [];
        }
      )
      .addMatcher(
        userApi.endpoints.getAllUsers.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error?.data?.message || "Failed to fetch users";
        }
      );

    // ---------------- GET SINGLE USER ----------------
    builder
      .addMatcher(userApi.endpoints.getUserById.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.getUserById.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.singleUser = payload;
        }
      )
      .addMatcher(
        userApi.endpoints.getUserById.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error?.data?.message || "Failed to fetch user";
        }
      );

    // ---------------- LOGIN (addMatcher) ----------------
    builder
      .addMatcher(userApi.endpoints.loginUser.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addMatcher(
        userApi.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;

          // Save user to Redux state
          state.userData = payload.data;
          state.token = payload.data.token;

          // Save to localStorage
          localStorage.setItem("user", JSON.stringify(payload.data));
          localStorage.setItem("token", payload.data.token);
        }
      )

      .addMatcher(
        userApi.endpoints.loginUser.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error?.data?.message || "Login failed";
          toast.error(state.error);
        }
      );

  },
});

// export actions
export const { logout } = userSlice.actions;

// export reducer
export default userSlice.reducer;
