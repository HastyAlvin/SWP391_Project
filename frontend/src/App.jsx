import { useEffect, useState } from "react";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/reducers/authReducer";
import { Route, Routes } from "react-router-dom";
import ProtectUser from "./utils/ProtectUser";
import Dashboard from "./pages/Dashboard";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Orders";
import OrderDetails from "./components/dashboard/OrderDetails";
import Wishlist from "./components/dashboard/Wishlist";
import ChangePassword from "./components/dashboard/ChangePassword";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes([...allRoutes, routes]);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [token]);

  return (
    <Routes>
      {/* Public routes */}
      {allRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      
      {/* Protected dashboard routes */}
      <Route path="/dashboard" element={<ProtectUser />}>
        <Route path="" element={<Dashboard />}>
          <Route path="" element={<Index />} />
          <Route path="my-wishlist" element={<Wishlist />} />
          <Route path="my-orders" element={<Orders />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="order/details/:orderId" element={<OrderDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;