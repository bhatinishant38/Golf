import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import Userhome from "./pages/UserHome";
import Dashboard from "./pages/Dashboard";
import Draws from "./pages/Draws";
import Scroes from "./pages/Scroes";
import Charity from "./pages/Charity";
import Winnings from "./pages/Winnings";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/pricing" element={<Pricing />}></Route>
        <Route path="/userhome" element={<Userhome />}>
          <Route index element={<Dashboard />} />
          <Route path="scores" element={<Scroes />} />
          <Route path="draws" element={<Draws />} />
          <Route path="charity" element={<Charity />} />
          <Route path="winnings" element={<Winnings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Setting />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
