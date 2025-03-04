// Import các hàm cần thiết từ Redux Toolkit
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";  
// Import module API để gọi request đến server  
import api from "../../api/api";  

// =============================
// 🔥 TẠO CÁC HÀM ASYNC THUNK 🔥
// =============================

// Hàm async để lấy danh mục sản phẩm từ API  
export const get_category = createAsyncThunk(
    'product/get_category', // Tên action
    async(_, { fulfillWithValue }) => {
        try {
            // Gọi API lấy danh mục sản phẩm
            const { data } = await api.get('/home/get-categorys');  
            return fulfillWithValue(data); // Trả về dữ liệu nếu thành công
        } catch (error) {
            console.log(error.response); // In lỗi ra console nếu có
        }
    }
);

// Hàm async để lấy danh sách sản phẩm từ API  
export const get_products = createAsyncThunk(
    'product/get_products',
    async(_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/get-products');  
            console.log(data); // In dữ liệu ra console (kiểm tra thử)
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

// Hàm async để lấy khoảng giá sản phẩm mới nhất
export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async(_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/price-range-latest-product');
            console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

// Hàm async để lấy sản phẩm dựa trên bộ lọc (category, price, rating...)
export const query_products = createAsyncThunk(
    'product/query_products',
    async(query , { fulfillWithValue }) => {
        try {
            // Gửi request với nhiều query parameters
            const { data } = await api.get(`/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}&&searchValue=${query.searchValue ? query.searchValue : ''}`);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

// Hàm async để lấy chi tiết sản phẩm từ API theo slug
export const product_details = createAsyncThunk(
    'product/product_details',
    async(slug, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/product-details/${slug}`);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

// Hàm async để khách hàng gửi đánh giá sản phẩm
export const customer_review = createAsyncThunk(
    'review/customer_review',
    async(info, { fulfillWithValue }) => {
        try {
            const { data } = await api.post('/home/customer/submit-review', info);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

// Hàm async để lấy danh sách đánh giá sản phẩm từ API
export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async({ productId, pageNumber }, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

// Hàm async để lấy danh sách banner quảng cáo
export const get_banners = createAsyncThunk(
    'banner/get_banners',
    async( _ , { fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/banners`);
            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response);
        }
    }
);

// =============================
// 🔥 TẠO SLICE QUẢN LÝ STATE 🔥
// =============================
export const homeReducer = createSlice({
    name: 'home', // Tên slice
    initialState: { // Trạng thái ban đầu
        categorys: [], // Danh mục sản phẩm
        products: [], // Danh sách sản phẩm
        totalProduct: 0, // Tổng số sản phẩm
        parPage: 3, // Số sản phẩm mỗi trang
        latest_product: [], // Sản phẩm mới nhất
        topRated_product: [], // Sản phẩm được đánh giá cao nhất
        discount_product: [], // Sản phẩm giảm giá
        priceRange: { low: 0, high: 100 }, // Khoảng giá sản phẩm
        product: {}, // Chi tiết sản phẩm
        relatedProducts: [], // Sản phẩm liên quan
        moreProducts: [], // Sản phẩm khác
        errorMessage: '', // Thông báo lỗi
        successMessage: '', // Thông báo thành công
        totalReview: 0, // Tổng số đánh giá
        rating_review: [], // Dữ liệu đánh giá
        reviews: [], // Danh sách đánh giá
        banners: [] // Danh sách banner quảng cáo
    },
    reducers: { // Các reducer thông thường
        // Hàm xóa thông báo lỗi và thành công
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => { // Xử lý action bất đồng bộ từ createAsyncThunk
        builder
        .addCase(get_category.fulfilled, (state, { payload }) => {
            state.categorys = payload.categorys; // Cập nhật danh mục sản phẩm
        })
        .addCase(get_products.fulfilled, (state, { payload }) => {
            state.products = payload.products; // Cập nhật danh sách sản phẩm
            state.latest_product = payload.latest_product;
            state.topRated_product = payload.topRated_product;
            state.discount_product = payload.discount_product;
        })
        .addCase(price_range_product.fulfilled, (state, { payload }) => { 
            state.latest_product = payload.latest_product; // Cập nhật sản phẩm mới nhất
            state.priceRange = payload.priceRange; // Cập nhật khoảng giá sản phẩm
        })
        .addCase(query_products.fulfilled, (state, { payload }) => { 
            state.products = payload.products; // Cập nhật danh sách sản phẩm
            state.totalProduct = payload.totalProduct; // Cập nhật tổng số sản phẩm
            state.parPage = payload.parPage; // Cập nhật số sản phẩm mỗi trang
        })
        .addCase(product_details.fulfilled, (state, { payload }) => { 
            state.product = payload.product; // Cập nhật thông tin sản phẩm chi tiết
            state.relatedProducts = payload.relatedProducts; // Cập nhật sản phẩm liên quan
            state.moreProducts = payload.moreProducts; // Cập nhật danh sách sản phẩm khác
        })
        .addCase(customer_review.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // Cập nhật thông báo thành công
        })
        .addCase(get_reviews.fulfilled, (state, { payload }) => {
            state.reviews = payload.reviews; // Cập nhật danh sách đánh giá
            state.totalReview = payload.totalReview; // Cập nhật tổng số đánh giá
            state.rating_review = payload.rating_review; // Cập nhật dữ liệu đánh giá
        })
        .addCase(get_banners.fulfilled, (state, { payload }) => {
            state.banners = payload.banners; // Cập nhật danh sách banner quảng cáo
        });
    }
});

// Xuất reducer và action
export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
