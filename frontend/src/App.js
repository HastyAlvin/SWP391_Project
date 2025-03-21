import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { get_category } from "./store/reducers/homeReducer";
import { useDispatch } from "react-redux";
import Details from "./pages/Details";
import SearchProducts from "./pages/SearchProducts";
import Shops from "./pages/Shops";
import Login from "./components/Login";
import Register from "./components/Register";
import Card from "./pages/Card";
import Shipping from "./pages/Shipping";
import ConfirmOrder from './pages/ConfirmOrder';

import ProtectUser from "./utils/ProtectUser";
import Dashboard from "./pages/Dashboard";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Orders";
import OrderDetails from "./components/dashboard/OrderDetails";
import Payment from "./pages/Payment";
import Wishlist from "./components/dashboard/Wishlist";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_category());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/products/search?" element={<SearchProducts />} />
        <Route path="/product/details/:slug" element={<Details />} />
        <Route path="/card" element={<Card />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path='/order/confirm?' element={<ConfirmOrder/>} /> 


        <Route path="/dashboard" element={<ProtectUser />}>
          <Route path="" element={<Dashboard />}>
            <Route path="" element={<Index />} />
            <Route path='my-wishlist' element={<Wishlist/>} /> 
            <Route path="my-orders" element={<Orders />} />
            <Route path="order/details/:orderId" element={<OrderDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
