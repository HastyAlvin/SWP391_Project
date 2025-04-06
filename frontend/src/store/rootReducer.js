import authReducer from "./reducers/authReducer";
import cardReducer from "./reducers/cardReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import homeReducer from "./reducers/homeReducer";
import orderReducer from "./reducers/orderReducer";
import adminReducer from "./Reducers/adminReducer";

const rootReducer = {
    home: homeReducer,
    auth: authReducer,
    card: cardReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,

}
export default rootReducer;