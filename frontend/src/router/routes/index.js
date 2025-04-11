import MainLayout from "../../layout/MainLayout";
import { privateRoutes } from "./privateRoutes";
import ProtectRoute from "./ProtectRoute";
export const getRoutes = () => {

  // eslint-disable-next-line array-callback-return
  privateRoutes.map((route) => {
    route.element = <ProtectRoute route={route}>{route.element}</ProtectRoute>;
  });

  return {
    path: "/",
    element: <MainLayout />,
    children: privateRoutes,
  };
};
