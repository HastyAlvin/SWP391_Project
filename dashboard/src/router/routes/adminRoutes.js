import { lazy } from "react";



const OrderDetails = lazy(() => import("../../views/admin/OrderDetails"));
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Orders = lazy(() => import("../../views/admin/Order"));
const Category = lazy(() => import("../../views/admin/Category"));

export const adminRoutes = [
  {
    path: "admin/dashboard",
    element: <AdminDashboard />,
    role: "admin",
  },

  {
    path: "admin/dashboard/orders",
    element: <Orders />,
    role: "admin",
  },

  {
    path: "admin/dashboard/category",
    element: <Category />,
    role: "admin",
  },
  {
    path: "admin/dashboard/order/details/:orderId",
    element: <OrderDetails />,
    role: "admin",
  },
];
