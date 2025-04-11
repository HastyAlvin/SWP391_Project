import OrderReducer from "./Reducers/OrderReducer";
import PaymentReducer from "./Reducers/PaymentReducer";
import authReducer from "./Reducers/authReducer";
import bannerReducer from "./Reducers/bannerReducer";
import categoryReducer from "./Reducers/categoryReducer";
// import chatReducer from "./Reducers/chatReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";
import userSlice from "./Reducers/userSlice";
import adminReducer from "./Reducers/adminReducer";
import customerReducer from "./Reducers/customerReducer";

const rootReducer = {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    seller: sellerReducer,
    user: userSlice,
    admin: adminReducer,
    customer: customerReducer,
    // chat: chatReducer,
    order: OrderReducer,
    payment: PaymentReducer,
    dashboard: dashboardReducer,
    banner: bannerReducer
}
export default rootReducer;