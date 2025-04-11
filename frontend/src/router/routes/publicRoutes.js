import { lazy } from "react";
const Card = lazy(() => import("../../pages/Card"));
const Login = lazy(() => import("../../pages/Login"));
const Shops= lazy(() => import("../../pages/Shops"));
const Home = lazy(() => import("../../pages/Home"));
const Register = lazy(() => import("../../pages/auth/Register"));
const CustomerRegister = lazy(() => import("../../pages/CustomerRegister"));
const AdminLogin = lazy(() => import("../../pages/auth/AdminLogin"));
const UnAthorized = lazy(() => import("../../pages/auth/UnAuthorized"));
const Shipping = lazy(() => import("../../pages/Shipping"));
const Payment = lazy(() => import("../../pages/Payment"));
const CategoryShop = lazy(() => import("../../pages/CategoryShop"));
const SearchProducts = lazy(() => import("../../pages/SearchProducts"));
const Details = lazy(() => import("../../pages/Details"));
const ConfirmOrder = lazy(() => import("../../pages/ConfirmOrder"));
const DashBoard = lazy(() => import("../../pages/Dashboard"));

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/shops",
    element: <Shops />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "seller/register",
    element: <Register />,
  },
  {
    path: "/register",
    element: <CustomerRegister />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/card",
    element: <Card />,
    role: "customer",
  },
  {
    path: "/unauthorized",
    element: <UnAthorized />,
  },
  {
    path: "/payment",
    element: <Payment />,
    role: "customer",
  },
  {
    path: "dashboard",
    element: <DashBoard />,
    role: "customer",
  },

  {
    path: "/shipping",
    element: <Shipping />,
    role: "customer",
  },
  {
    path: "/products?",
    element: <CategoryShop />,
    role: "customer",
  },
  {
    path: "/products/search?",
    element: <SearchProducts/>,
    role: "customer",
  },

  {
    path: "/product/details/:slug",
    element: <Details />,
    role: "customer",
  },
  {
    path: "/order/confirm?",
    element: <ConfirmOrder />,
    role: "customer",
  },
];

export default publicRoutes;
