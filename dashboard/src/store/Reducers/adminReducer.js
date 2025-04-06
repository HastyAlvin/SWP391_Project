import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Lấy tất cả sellers
export const get_all_sellers = createAsyncThunk(
  "admin/get_all_sellers",
  async ({ page, searchValue, parPage, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/admin/sellers?page=${page}&searchValue=${searchValue}&parPage=${parPage}&status=${status}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy thông tin chi tiết của 1 seller
export const get_seller_details = createAsyncThunk(
  "admin/get_seller_details",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/admin/seller/${sellerId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thêm seller mới
export const add_seller = createAsyncThunk(
  "admin/add_seller",
  async (sellerData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin/seller/add", sellerData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật thông tin seller
export const update_seller = createAsyncThunk(
  "admin/update_seller",
  async ({ sellerId, sellerData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/admin/seller/update/${sellerId}`, sellerData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thay đổi mật khẩu seller
export const change_seller_password = createAsyncThunk(
  "admin/change_seller_password",
  async ({ sellerId, newPassword }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/admin/seller/change-password/${sellerId}`,
        { newPassword },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Xóa seller
export const delete_seller = createAsyncThunk(
  "admin/delete_seller",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/seller/delete/${sellerId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const adminReducer = createSlice({
  name: "admin",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    sellers: [],
    totalSellers: 0,
    seller: null,
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // get_all_sellers
      .addCase(get_all_sellers.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_all_sellers.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra";
      })
      .addCase(get_all_sellers.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.sellers = payload.sellers;
        state.totalSellers = payload.totalSeller;
      })

      // get_seller_details
      .addCase(get_seller_details.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_seller_details.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra";
      })
      .addCase(get_seller_details.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.seller = payload.seller;
      })

      // add_seller
      .addCase(add_seller.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_seller.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra";
      })
      .addCase(add_seller.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })

      // update_seller
      .addCase(update_seller.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_seller.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra";
      })
      .addCase(update_seller.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.seller = payload.seller;
      })

      // change_seller_password
      .addCase(change_seller_password.pending, (state) => {
        state.loader = true;
      })
      .addCase(change_seller_password.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra";
      })
      .addCase(change_seller_password.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })

      // delete_seller
      .addCase(delete_seller.pending, (state) => {
        state.loader = true;
      })
      .addCase(delete_seller.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra";
      })
      .addCase(delete_seller.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      });
  },
});

export const { messageClear } = adminReducer.actions;
export default adminReducer.reducer;