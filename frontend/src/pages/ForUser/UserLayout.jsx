import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

// Sidebar on the left, the current page on the right.
// min-w-0 + flex-1 is what stops wide content from pushing the page off screen.
const UserLayout = ({ setToken }) => (
  
  <div className="flex min-h-screen bg-[#F4F7F5]">
    <Sidebar setToken={setToken} />
    <main className="min-w-0 flex-1 p-4 md:p-8">
      <Outlet />
    </main>
  </div>
);

export default UserLayout;
