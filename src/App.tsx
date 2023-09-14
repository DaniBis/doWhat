import { useState } from 'react';
import './App.css';
import MenuBar from './navbar/menu';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Activities from './pages/Activities';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <>   
      <BrowserRouter>
      <MenuBar />
      <Routes>
          <Route path="/" element={<Activities/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<SignupPage/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
