import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/ForPublic/LandingPage";
import Register from "./pages/ForPublic/Register";
import Pricing from "./pages/ForUser/Pricing";
import Login from "./pages/ForPublic/Login";
import { ToastContainer } from "react-toastify";
import Userhome from "./pages/ForUser/UserHome";
import Dashboard from "./pages/ForUser/Dashboard";
import Draws from "./pages/ForUser/Draws";

import Charity from "./pages/ForUser/Charity";
import Winnings from "./pages/ForUser/Winnings";
import Profile from "./pages/ForUser/Profile";
import Setting from "./pages/ForUser/Setting";
import { AppContext } from "./context/AppContext";
import Scores from "./pages/ForUser/Scores";

const App = () => {
  const { token, backendUrl } = useContext(AppContext);
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
          <Route
            path="scores"
            element={<Scores token={token} backendUrl={backendUrl} />}
          />
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
