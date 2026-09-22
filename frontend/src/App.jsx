import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/ForPublic/LandingPage";
import Register from "./pages/ForPublic/Register";
import Pricing from "./components/ForAll/Pricing";
import Login from "./pages/ForPublic/Login";

import Userhome from "./pages/ForUser/UserHome";
import Dashboard from "./pages/ForUser/Dashboard";
import Draws from "./pages/ForUser/Draws";
import Charity from "./pages/ForUser/CharityCard";
import DonateCharity from "./pages/ForUser/DonateCharity"; // <-- ADD THIS IMPORT
import Winnings from "./pages/ForUser/Winnings";
import Profile from "./pages/ForUser/Profile";
import Scores from "./pages/ForUser/Scores";

import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { token } = useContext(AppContext);

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/userhome" replace /> : <LandingPage />
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected User Routes */}
        <Route
          path="/userhome"
          element={token ? <Userhome /> : <Navigate to="/" replace />}
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Other user pages */}
          <Route path="scores" element={<Scores />} />
          <Route path="draws" element={<Draws />} />
          <Route path="charity" element={<Charity />} />
          {/* Donate route - ADD THIS - matches navigate(`/userhome/charity/donate/${charity._id}`) */}
          <Route path="charity/donate/:id" element={<DonateCharity />} />
          <Route path="winnings" element={<Winnings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
