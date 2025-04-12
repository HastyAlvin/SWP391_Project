import { Route, Routes } from "react-router-dom";
import ProtectUser from "./utils/ProtectUser";
import Dashboard from "./pages/Dashboard";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Orders";
import OrderDetails from "./components/dashboard/OrderDetails";
import Wishlist from "./components/dashboard/Wishlist";
import ChangePassword from "./components/dashboard/ChangePassword";

function App2() {
  return (
    <Routes>  
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

export default App2;