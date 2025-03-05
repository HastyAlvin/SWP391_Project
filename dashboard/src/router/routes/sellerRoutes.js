import { lazy } from "react";            
import Profile from "../../views/seller/Profile";
const SellerDashboard = lazy(()=> import('../../views/seller/SellerDashboard'))   
const Pending = lazy(()=> import('./../../views/Pending')) 
const Deactive = lazy(()=> import('./../../views/Deactive')) 
// const AddBanner = lazy(()=> import('../../views/seller/AddBanner')) 

export const sellerRoutes = [
    
    {
        path: '/seller/account-pending',
        element : <Pending/>,
        ability : 'seller' 
    },
    {
        path: '/seller/account-deactive',
        element : <Deactive/>,
        ability : 'seller' 
    },
    {
        path: '/seller/dashboard',
        element : <SellerDashboard/>,
        role : 'seller',
        status : 'active'
    },
    {
        path: '/seller/dashboard/profile',
        element : <Profile/>,
        role : 'seller',
        visibility : ['active','deactive','pending']
    },

]