import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/category-add', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_category = createAsyncThunk(
    'category/get_category',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`category-get?page=${page}&searchValue=${searchValue}&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('name', name)
            if (image) {
                formData.append('image', image)
            }
            const { data } = await api.put(`/category-update/${id}`, formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/category/${id}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categorys: [],
        totalCategory: 0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(categoryAdd.pending, (state) => {
                state.loader = true
            })
            .addCase(categoryAdd.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.error
            })
            .addCase(categoryAdd.fulfilled, (state, { payload }) => {
                state.loader = false
                state.successMessage = payload.message
                state.categorys = [...state.categorys, payload.category]
            })
            .addCase(get_category.pending, (state) => {
                state.loader = true
            })
            .addCase(get_category.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.error
            })
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.loader = false
                state.totalCategory = payload.totalCategory
                state.categorys = payload.categorys
            })
            .addCase(updateCategory.pending, (state) => {
                state.loader = true
            })
            .addCase(updateCategory.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.error
            })
            .addCase(updateCategory.fulfilled, (state, { payload }) => {
                state.loader = true
                state.successMessage = payload.message
                const index = state.categorys.findIndex(cat => cat._id === payload.category._id)
                if (index !== -1) {
                    state.categorys[index] = payload.category
                }
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loader = true
            })
            .addCase(deleteCategory.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.error
            })
            .addCase(deleteCategory.fulfilled, (state, { payload }) => {
                state.loader = false
                state.successMessage = payload.message
                state.categorys = state.categorys.filter(cat => cat._id !== payload.categoryId)
            })
    }
})

export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer