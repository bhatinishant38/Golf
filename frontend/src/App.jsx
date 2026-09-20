import React from 'react'
import { Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './pages/Dashboard'


const App = () => {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/pricing' element={<Pricing/>}></Route>    
      <Route path='/dashboard' element={<Dashboard/>}></Route>    
    </Routes>
    </>
  )
}

export default App