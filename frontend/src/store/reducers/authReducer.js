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

//Copy tu dashboard
export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_login = createAsyncThunk(
  "auth/seller_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🟢 Đổi mật khẩu
export const customer_change_password = createAsyncThunk(
  "auth/customer_change_password",
  async (passwordData, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Sử dụng endpoint "/customer/change-password" và withCredentials để gửi cookie
      const { data } = await api.put(
        "/customer/change-password",
        passwordData,
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", { withCredentials: true });
      console.log("User: " + JSON.stringify(data));
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_image_upload = createAsyncThunk(
  "auth/profile_image_upload",
  async (image, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-image-upload", image, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_register = createAsyncThunk(
  "auth/seller_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-register", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_info_add = createAsyncThunk(
  "auth/profile_info_add",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-info-add", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_info_update = createAsyncThunk(
  "auth/profile_info_update",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put("/profile-info-update", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/logout", { withCredentials: true });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("customerToken");
      if (role === "admin") {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Phân role
const returnRole = (token) => {
  if (token) {
    const decodeToken = jwtDecode(token);
    const expireTime = new Date(decodeToken.exp * 1000);
    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return "";
    } else {
      return decodeToken.role;
    }
  } else {
    return "";
  }
};

// 🟢 Giải mã token
const decodeToken = (token) => {
  return token ? jwtDecode(token) : "";
};

// 🟢 Auth Slice
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo:
      decodeToken(localStorage.getItem("customerToken")) ||
      decodeToken(localStorage.getItem("accessToken")),
    errorMessage: "",
    successMessage: "",
    role:
      returnRole(localStorage.getItem("accessToken")) ||
      returnRole(localStorage.getItem("customerToken")),
      token: localStorage.getItem("accessToken") || localStorage.getItem("customerToken"),
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state) => {
      state.userInfo = "";
      localStorage.removeItem("customerToken");
      localStorage.removeItem("accessToken");
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
        state.role = returnRole(payload.token);
      })
      // Xử lý đăng nhập sellers
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_login.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Login failed!";
        state.loader = false;
      })
      .addCase(seller_login.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = decodeToken(payload.token);
        state.role = returnRole(payload.token);
      })
      // Xử lý đăng nhập admin
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Login failed!";
        state.loader = false;
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = decodeToken(payload.token);
        state.role = returnRole(payload.token);
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
        state.successMessage =
          payload.message || "Password changed successfully!";
        // Sau khi đổi mật khẩu thành công, reset thông tin người dùng và xóa token để buộc đăng nhập lại
        state.userInfo = "";
        localStorage.removeItem("customerToken");
        localStorage.removeItem("accessToken");
      })
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(seller_register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
      })
      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
      })
      .addCase(profile_image_upload.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.successMessage = payload.message;
      })
      .addCase(profile_info_add.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_info_add.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.successMessage = payload.message;
      })
      .addCase(profile_info_update.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_info_update.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.successMessage = payload.message;
      });
  },
});

export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;
