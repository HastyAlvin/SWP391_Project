import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

// 🟢 Đăng ký
export const customer_register = createAsyncThunk(
  "auth/customer_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/customer-register", info);
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Registration failed!" }
      );
    }
  }
);

// 🟢 Đăng nhập
export const customer_login = createAsyncThunk(
  "auth/customer_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/customer-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Login failed!" }
      );
    }
  }
);

// 🟢 Đổi mật khẩu
export const customer_change_password = createAsyncThunk(
    "auth/customer_change_password",
    async (passwordData, { rejectWithValue, fulfillWithValue }) => {
      try {
        // Sử dụng endpoint "/customer/change-password" và withCredentials để gửi cookie
        const { data } = await api.put("/customer/change-password", passwordData, {
          withCredentials: true,
        });
        return fulfillWithValue(data);
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

// 🟢 Giải mã token
const decodeToken = (token) => {
  return token ? jwtDecode(token) : "";
};

// 🟢 Auth Slice
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo: decodeToken(localStorage.getItem("customerToken")),
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state) => {
      state.userInfo = "";
      localStorage.removeItem("customerToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý đăng ký
      .addCase(customer_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(customer_register.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Registration failed!";
        state.loader = false;
      })
      .addCase(customer_register.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = decodeToken(payload.token);
      })
      // Xử lý đăng nhập
      .addCase(customer_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(customer_login.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Login failed!";
        state.loader = false;
      })
      .addCase(customer_login.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = decodeToken(payload.token);
      })
      // Xử lý đổi mật khẩu
      .addCase(customer_change_password.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(customer_change_password.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Password change failed!";
      })
      .addCase(customer_change_password.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message || "Password changed successfully!";
        // Sau khi đổi mật khẩu thành công, reset thông tin người dùng và xóa token để buộc đăng nhập lại
        state.userInfo = "";
        localStorage.removeItem("customerToken");
      });
  },
});

export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;
