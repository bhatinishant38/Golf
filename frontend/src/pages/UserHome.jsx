import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { AppContext } from "../context/AppContext";

import Sidebar from "../components/Sidebar";
const Userhome = () => {
  const { setToken } = useContext(AppContext);

  return (
    <div className="flex min-h-screen bg-[#F4F7F5]">
      <Sidebar setToken={setToken} />
      <Outlet />
    </div>
  );
};

export default Userhome;
