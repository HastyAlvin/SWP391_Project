import { lazy } from "react";    
const AdminLogin = lazy(()=> import('../../views/auth/AdminLogin')) 


const publicRoutes = [
   
    {
        path : '/admin/login',
        element : <AdminLogin/>
    },
   
]

export default publicRoutes