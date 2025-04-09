import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Lấy danh sách tất cả khách hàng
export const get_all_customers = createAsyncThunk(
  "customer/get_all_customers",
  async ({ page, searchValue, parPage }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/customers?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy thông tin chi tiết của khách hàng
export const get_customer_details = createAsyncThunk(
  "customer/get_customer_details",
  async (customerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/customers/${customerId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thêm khách hàng mới
export const add_customer = createAsyncThunk(
  "customer/add_customer",
  async (customerData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customers", customerData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật thông tin khách hàng
export const update_customer = createAsyncThunk(
  "customer/update_customer",
  async ({ customerId, customerData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/customers/${customerId}`, customerData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Xóa khách hàng
export const delete_customer = createAsyncThunk(
  "customer/delete_customer",
  async (customerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/customers/${customerId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const customerReducer = createSlice({
  name: "customer",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    customers: [],
    totalCustomers: 0,
    customer: null,
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // get_all_customers
      .addCase(get_all_customers.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_all_customers.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra khi lấy danh sách khách hàng";
      })
      .addCase(get_all_customers.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.customers = payload.customers;
        state.totalCustomers = payload.totalCustomer;
      })

      // get_customer_details
      .addCase(get_customer_details.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_customer_details.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra khi lấy thông tin khách hàng";
      })
      .addCase(get_customer_details.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.customer = payload.customer;
      })

      // add_customer
      .addCase(add_customer.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_customer.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra khi thêm khách hàng";
      })
      .addCase(add_customer.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })

      // update_customer
      .addCase(update_customer.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_customer.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra khi cập nhật khách hàng";
      })
      .addCase(update_customer.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.customer = payload.customer;
      })

      // delete_customer
      .addCase(delete_customer.pending, (state) => {
        state.loader = true;
      })
      .addCase(delete_customer.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Có lỗi xảy ra khi xóa khách hàng";
      })
      .addCase(delete_customer.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      });
  },
});

export const { messageClear } = customerReducer.actions;
export default customerReducer.reducer;