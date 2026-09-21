import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Charities from "./pages/Charities";

// Stand-in for pages you haven't built yet, so the sidebar links don't open a blank screen.
const ComingSoon = ({ title }) => (
  <div className="py-16 text-center">
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    <p className="mt-1 text-sm text-gray-500">This page is coming soon.</p>
  </div>
);

const App = () => {
  const {atoken ,setAToken} = useContext(AppContext)

  // Not logged in: show only the login page
  if (!atoken) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<AdminLogin/>}></Route>
        </Routes>
      </>
    );
  }

  // Logged in: sidebar + pages
  return (
    <div className="flex min-h-screen bg-[#F4F7F5]">
      <ToastContainer />
      <Sidebar  />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />       
          <Route path="/users" element={<Users />} />
          <Route path="/subscriptions" element={<ComingSoon title="Subscriptions" />} />
          <Route path="/draws" element={<ComingSoon title="Draws" />} />
          <Route path="/charities" element={<Charities/>} />
          <Route path="/winners" element={<ComingSoon title="Winners" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
