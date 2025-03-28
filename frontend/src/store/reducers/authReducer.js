import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// 🟢 Đăng ký
export const customer_register = createAsyncThunk(
    "auth/customer_register",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/customer/customer-register", info);
            localStorage.setItem("customerToken", data.token);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Registration failed!" });
        }
    }
);

// 🟢 Đăng nhập
export const customer_login = createAsyncThunk(
    "auth/customer_login",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/customer/customer-login", info, {
                withCredentials: true, // 🟢 Quan trọng: Lưu cookies
            });

            localStorage.setItem("customerToken", data.token);
            console.log("🔑 Token sau khi đăng nhập:", data.token);

            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Login failed!" });
        }
    }
);
// 🟢 Đổi mật khẩu
export const customer_change_password = createAsyncThunk(
    "auth/customer_change_password",
    async (passwordData, { rejectWithValue }) => {
        try {
          const { data } = await axios.put("http://localhost:5000/api/customer/change-password", passwordData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` },
            withCredentials: true, // Cho phép gửi cookies
          });
    
          return data;
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
        },
    },
    extraReducers: (builder) => {
        builder
            // ✅ Xử lý đăng ký
            .addCase(customer_register.pending, (state) => {
                state.loader = true;
            })
            .addCase(customer_register.rejected, (state, { payload }) => {
                state.errorMessage = payload?.error || "Registration failed!";
                state.loader = false;
            })
            .addCase(customer_register.fulfilled, (state, { payload }) => {
                const userInfo = decodeToken(payload.token);
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = userInfo;
            })

            // ✅ Xử lý đăng nhập
            .addCase(customer_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(customer_login.rejected, (state, { payload }) => {
                state.errorMessage = payload?.error || "Login failed!";
                state.loader = false;
            })
            .addCase(customer_login.fulfilled, (state, { payload }) => {
                const userInfo = decodeToken(payload.token);
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = userInfo;
            })

            // ✅ Xử lý đổi mật khẩu
            .addCase(customer_change_password.pending, (state) => {
                state.loader = true;
                state.errorMessage = "";
                state.successMessage = "";
            })
            .addCase(customer_change_password.rejected, (state, { payload }) => {
                state.errorMessage = payload?.error || "Password change failed!";
                state.loader = false;
            })
            .addCase(customer_change_password.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = ""; // Xóa userInfo sau khi đổi mật khẩu
            });
    },
});

export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;