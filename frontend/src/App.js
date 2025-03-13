import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { get_category } from './store/reducers/homeReducer';
import { useDispatch} from 'react-redux';
import Details from './pages/Details';
import SearchProducts from './pages/SearchProducts';



function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category()) 
},[])


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/product/details/:slug' element={<Details/>} />
      <Route path='/products/search?' element={<SearchProducts/>} />
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;
