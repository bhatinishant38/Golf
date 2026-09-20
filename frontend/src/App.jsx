import React from 'react'
import { Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Pricing from './pages/Pricing'
import Login from './pages/Login'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/pricing' element={<Pricing/>}></Route>    
    </Routes>
    
  )
}

export default App