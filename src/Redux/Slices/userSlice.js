import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

// 🔹 Async Thunk for Registering User
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { userData, userRole, vendorData, deliveryData },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("role", userRole);
      if (userRole === "Vendor") {
        console.log("Appending vendorData:", vendorData);
        Object.entries(vendorData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      const response = await axios.post(
        `${BASE_URL}/api/auth/allRegister`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === "1") {
        toast.success("Registration successful!");
      } else {
        toast.error(response.data.message || "Registration failed");
        return rejectWithValue(response.data);
      }
      return response.data;

      // toast.success("Registration successful!");
      // return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const deliveryUser = createAsyncThunk(
  "user/registerDeliveryUser",
  async ({ userData, userRole, formData }, { rejectWithValue }) => {
    try {
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("role", userRole);
      const response = await axios.post(
        `${BASE_URL}/api/auth/allRegister`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// 🔹 Async Thunk for Logging in User
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/allLogins`, {
        emailOrPhone: email,
        password,
      });

      toast.success(response.data.message || "Login successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
      return rejectWithValue(error.response?.data || "Login failed!");
    }
  }
);

// 🔹 Async Thunk for Fetching All Users
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/users`); // Assuming the API to get all users
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

// 🔹 Async Thunk for Fetching a User by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/users/${userId}`); // API to get a user by ID
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user");
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

const initialState = {
  userData: null,
  userRole: null,
  allUsers:[],
  singleUser:[],
  vendorData: null,
  token: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setVendorData: (state, action) => {
      state.vendorData = action.payload;
    },
    logout: (state) => {
      state.userData = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.userData;
        state.userRole = action.payload.userRole;
        state.vendorData = action.payload.vendorData;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong!";
      })
      .addCase(deliveryUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deliveryUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.userData;
        state.userRole = action.payload.userRole;
      })
      .addCase(deliveryUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong!";
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.data;
        state.token = action.payload.data.token;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
        localStorage.setItem("token", action.payload.data.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong!";
      })
      // New case for fetching all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload; // Assuming we want to store all users here
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong!";
      })
      // New case for fetching a single user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleUser = action.payload; // Store the fetched user
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong!";
      });
  },
});

export const { setUserData, setUserRole, setVendorData, logout } =
  userSlice.actions;
export default userSlice.reducer;
