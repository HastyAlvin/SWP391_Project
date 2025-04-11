import { lazy } from "react";

// const Home = lazy(() => import("../../pages/Home"));

// const Card = lazy(() => import("../../pages/Card"));
const Shipping = lazy(() => import("../../pages/Shipping"));
const Payment = lazy(() => import("../../pages/Payment"));
const CategoryShop = lazy(() => import("../../pages/CategoryShop"));
const SearchProducts = lazy(() => import("../../pages/SearchProducts"));
const Details = lazy(() => import("../../pages/Details"));
const ConfirmOrder = lazy(() => import("../../pages/ConfirmOrder"));
const DashBoard = lazy(() => import("../../pages/Dashboard"));


export const customerRoutes = [
//   {
//     path: "/",
//     element: <Home />,
//     role: "customer",
//   },

  {
    path: "/payment",
    element: <Payment />,
    role: "customer",
  },
  {
    path: "userdashboard",
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
