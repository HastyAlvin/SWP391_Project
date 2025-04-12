import authReducer from "./reducers/authReducer";
import cardReducer from "./reducers/cardReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import homeReducer from "./reducers/homeReducer";
import orderReducer from "./reducers/orderReducer";

// import OrderReducer from "./reducers/OrderReducer";
import PaymentReducer from "./reducers/PaymentReducer";
// import authReducer from "./reducers/authReducer";
import bannerReducer from "./reducers/bannerReducer";
import categoryReducer from "./reducers/categoryReducer";
// import chatReducer from "./reducers/chatReducer";
// import dashboardReducer from "./reducers/dashboardReducer";
import productReducer from "./reducers/productReducer";
import sellerReducer from "./reducers/sellerReducer";
import userSlice from "./reducers/userSlice";

const rootReducer = {
    home: homeReducer,
    auth: authReducer,
    card: cardReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
    product: productReducer,
    seller: sellerReducer,
    user: userSlice,
    // chat: chatReducer,
    // order: OrderReducer,
    payment: PaymentReducer,
    // dashboard: dashboardReducer,
    banner: bannerReducer
}
export default rootReducer;