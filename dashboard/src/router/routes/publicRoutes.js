import { lazy } from "react";
const Login = lazy(() => import("../../views/auth/Login"));
const Home = lazy(() => import("../../views/Home"));

const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
];

export default publicRoutes;
