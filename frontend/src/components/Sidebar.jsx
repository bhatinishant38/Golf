import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Target, Gift, Heart,
  Trophy, User, Settings, LogOut,
} from "lucide-react";

const mainLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/scores", label: "My Scores", icon: Target },
  { to: "/draws", label: "Draws & Rewards", icon: Gift },
  { to: "/charity", label: "Charity", icon: Heart },
];

const accountLinks = [
  { to: "/winnings", label: "Winnings", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

const NavItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        isActive
          ? "bg-white/15 font-semibold text-white"
          : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

const Sidebar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken?.("");
    navigate("/login");
  };

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[#0B5D3B] px-4 py-6 text-white">
      <div className="mb-8 px-2 text-lg font-bold tracking-tight">Digital Heroes</div>

      <nav className="flex flex-col gap-1">
        {mainLinks.map((l) => <NavItem key={l.to} {...l} />)}
      </nav>

      <nav className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-6">
        {accountLinks.map((l) => <NavItem key={l.to} {...l} />)}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
