import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { AppContext } from "../../context/AppContext";

import Sidebar from "../../components/ForUser/Sidebar";
const Userhome = () => {
  const { setToken } = useContext(AppContext);

  return (
   
     <div className="flex min-h-screen bg-[#F4F7F5]">
       <Sidebar setToken={setToken} />
       <main className="min-w-0 flex-1 p-4 md:p-8">
         <Outlet />
       </main>
     </div>
  );
};

export default Userhome;
