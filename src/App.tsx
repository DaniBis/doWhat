import { useState } from 'react';
import './App.css';
import MenuBar from './navbar/menu';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Activities from './pages/Activities';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const queryClient = new QueryClient();

function App() {

  return (
    <>   
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MenuBar />
          <Routes>
              <Route path="/activities" element={<Activities/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/signup" element={<SignupPage/>} />
          </Routes>
      </BrowserRouter>
     <ReactQueryDevtools />
    </QueryClientProvider>
    </>
  )
}

export default App
