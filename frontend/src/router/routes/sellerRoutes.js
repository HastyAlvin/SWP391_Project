import { lazy } from "react";


const SellerDashboard = lazy(() =>
  import("../../pages/seller/SellerDashboard")
);
const Pending = lazy(() => import("./../../pages/Pending"));
const Deactive = lazy(() => import("./../../pages/Deactive"));
const Profile = lazy(() => import("../../pages/seller/Profile"));
const AddProduct = lazy(() => import("../../pages/seller/AddProduct"));
const Products = lazy(() => import("../../pages/seller/Products"));
// const DiscountProducts = lazy(() => import('../../pages/seller/DiscountProducts'))
const Orders = lazy(() => import('../../pages/seller/Orders'))
const Payments = lazy(() => import('../../pages/seller/Payments'))
// const SellerToAdmin = lazy(() => import('../../pages/seller/SellerToAdmin'))
// const SellerToCustomer = lazy(() => import('../../pages/seller/SellerToCustomer'))
const EditProduct = lazy(() => import('../../pages/seller/EditProduct'))
const OrderDetails = lazy(() => import('../../pages/seller/OrderDetails'))
const AddBanner = lazy(() => import('../../pages/seller/AddBanner'))

export const sellerRoutes = [
  {
    path: "/seller/account-pending",
    element: <Pending />,
    ability: "seller",
  },
  {
    path: "/seller/account-deactive",
    element: <Deactive />,
    ability: "seller",
  },
  {
    path: "/seller/dashboard",
    element: <SellerDashboard />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/add-product",
    element: <AddProduct />,
    role: "seller",
    status: "active",
  },
  {
    path: '/seller/dashboard/edit-product/:productId',
    element: <EditProduct />,
    role: 'seller',
    status: 'active'
  },
  {
    path: "/seller/dashboard/products",
    element: <Products />,
    role: "seller",
    status: "active",
  },
  // {
  //     path: '/seller/dashboard/discount-product',
  //     element : <DiscountProducts/>,
  //     role : 'seller',
  //     status : 'active'
  // },
  {
    path: "/seller/dashboard/orders",
    element: <Orders />,
    role: "seller",
    visibility: ["active", "deactive"],
  },
  {
    path: '/seller/dashboard/order/details/:orderId',
    element: <OrderDetails />,
    role: 'seller',
    visibility: ['active', 'deactive']
  },
  {
    path: "/seller/dashboard/payments",
    element: <Payments />,
    role: "seller",
    status: "active",
  },
  // {
  //     path: '/seller/dashboard/chat-support',
  //     element : <SellerToAdmin/>,
  //     role : 'seller',
  //     visibility : ['active','deactive','pending']
  // },
  // {
  //     path: '/seller/dashboard/chat-customer/:customerId',
  //     element : <SellerToCustomer/>,
  //     role : 'seller',
  //     status : 'active'
  // },
  // {
  //     path: '/seller/dashboard/chat-customer',
  //     element : <SellerToCustomer/>,
  //     role : 'seller',
  //     status : 'active'
  // },
  {
    path: "/seller/dashboard/profile",
    element: <Profile />,
    role: "seller",
    visibility: ["active", "deactive", "pending"],
  },
  {
    path: '/seller/dashboard/add-banner/:productId',
    element: <AddBanner />,
    role: 'seller',
    status: 'active'
  }
];
