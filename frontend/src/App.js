import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Card from './pages/Card';
import { get_category } from './store/reducers/homeReducer';
import { useDispatch} from 'react-redux';


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category()) 
},[])


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/card' element={<Card/>} />
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;
