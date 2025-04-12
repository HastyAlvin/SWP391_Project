import { lazy } from "react";

const OrderDetails = lazy(() => import("../../views/admin/OrderDetails"));
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Orders = lazy(() => import("../../views/admin/Order"));
const Category = lazy(() => import("../../views/admin/Category"));
const CategoryAdd = lazy(() => import("../../views/admin/category/CategoryAdd"));
const CategoryDetails = lazy(() => import("../../views/admin/category/CategoryDetails"));
const CategoryEdit = lazy(() => import("../../views/admin/category/CategoryEdit"));
const DeactiveSellers = lazy(() => import("../../views/admin/DeactiveSellers"));
const SellerRequest = lazy(() => import("../../views/admin/SellerRequest"));
const SellerDetails = lazy(() => import("../../views/admin/SellerDetails"));
const Sellers = lazy(() => import("../../views/admin/Sellers"));
const PaymentRequest = lazy(() => import("../../views/admin/PaymentRequest"));
const ManageSellers = lazy(() => import("../../views/admin/ManageSellers"));
const AddSeller = lazy(() => import("../../views/admin/AddSeller"));
const EditSeller = lazy(() => import("../../views/admin/EditSeller"));
const ChangeSellerPassword = lazy(() => import("../../views/admin/ChangeSellerPassword"));

// Customer management components
const ManageCustomers = lazy(() => import("../../views/admin/ManageCustomers"));
const CustomerDetails = lazy(() => import("../../views/admin/CustomerDetails"));
const AddCustomer = lazy(() => import("../../views/admin/AddCustomer"));
const EditCustomer = lazy(() => import("../../views/admin/EditCustomer"));

// Banner management components
const BannerList = lazy(() => import("../../views/admin/banners/BannerList"));
const BannerAdd = lazy(() => import("../../views/admin/banners/BannerAdd"));
const BannerEdit = lazy(() => import("../../views/admin/banners/BannerEdit"));

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
    path: "admin/dashboard/category/add",
    element: <CategoryAdd />,
    role: "admin",
  },
  {
    path: "admin/dashboard/category/details/:categoryId",
    element: <CategoryDetails />,
    role: "admin",
  },
  {
    path: "admin/dashboard/category/edit/:categoryId",
    element: <CategoryEdit />,
    role: "admin",
  },
  {
    path: "admin/dashboard/sellers",
    element: <Sellers />,
    role: "admin",
  },
  {
    path: "admin/dashboard/order/details/:orderId",
    element: <OrderDetails />,
    role: "admin",
  },

  {
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
  {
    path: "admin/dashboard/payment-request",
    element: <PaymentRequest />,
    role: "admin",
  },

  // Các routes quản lý seller
  {
    path: "admin/dashboard/manage-sellers",
    element: <ManageSellers />,
    role: "admin",
  },
  {
    path: "admin/dashboard/seller/add",
    element: <AddSeller />,
    role: "admin",
  },
  {
    path: "admin/dashboard/seller/edit/:sellerId",
    element: <EditSeller />,
    role: "admin",
  },
  {
    path: "admin/dashboard/seller/change-password/:sellerId",
    element: <ChangeSellerPassword />,
    role: "admin",
  },

  // Các routes quản lý khách hàng
  {
    path: "admin/dashboard/manage-customers",
    element: <ManageCustomers />,
    role: "admin",
  },
  {
    path: "admin/dashboard/customer/details/:customerId",
    element: <CustomerDetails />,
    role: "admin",
  },
  {
    path: "admin/dashboard/customer/add",
    element: <AddCustomer />,
    role: "admin",
  },
  {
    path: "admin/dashboard/customer/edit/:customerId",
    element: <EditCustomer />,
    role: "admin",
  },

  // Các routes quản lý banner
  {
    path: "admin/dashboard/banners",
    element: <BannerList />,
    role: "admin",
  },
  {
    path: "admin/dashboard/banner/add",
    element: <BannerAdd />,
    role: "admin",
  },
  {
    path: "admin/dashboard/banner/edit/:bannerId",
    element: <BannerEdit />,
    role: "admin",
  },
];
