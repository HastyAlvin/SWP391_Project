import { lazy } from "react";



const OrderDetails = lazy(() => import("../../views/admin/OrderDetails"));
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Orders = lazy(() => import("../../views/admin/Order"));
const Category = lazy(() => import("../../views/admin/Category"));
const DeactiveSellers = lazy(() => import("../../views/admin/DeactiveSellers"));
const SellerRequest = lazy(() => import("../../views/admin/SellerRequest"));
const SellerDetails = lazy(() => import("../../views/admin/SellerDetails"));
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
    path: "admin/dashboard/deactive-sellers",
    element: <DeactiveSellers />,
    role: "admin",
  },
  {
    path: "admin/dashboard/sellers-request",
    element: <SellerRequest />,
    role: "admin",
  },
  {
    path: "admin/dashboard/seller/details/:sellerId",
    element: <SellerDetails />,
    role: "admin",
  },
];
