import { lazy } from "react";
const Login = lazy(() => import("../../views/auth/Login"));
const Home = lazy(() => import("../../views/Home"));
const Register = lazy(()=> import('../../views/auth/Register')) 
const AdminLogin = lazy(()=> import('../../views/auth/AdminLogin')) 
const UnAthorized = lazy(()=> import('../../views/auth/UnAuthorized'))
const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path : '/register',
    element : <Register/>
},
{
    path : '/admin/login',
    element : <AdminLogin/>
},
{
  path : '/unauthorized',
  element : <UnAthorized/>
},
];

export default publicRoutes;
