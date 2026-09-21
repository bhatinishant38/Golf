import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Ticket,
  Heart,
  Trophy,
  FileText,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/users", label: "Users", icon: Users },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/draws", label: "Draws", icon: Ticket },
  { to: "/charities", label: "Charities", icon: Heart },
  { to: "/winners", label: "Winners", icon: Trophy },
  
];

const NavItem = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
    title={label}
    className={({ isActive }) =>
      `flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors md:justify-start md:px-3 ${
        isActive
          ? "bg-white/15 font-semibold text-white ring-1 ring-white/25"
          : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    <Icon size={18} className="shrink-0" />
    <span className="hidden md:inline">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const navigate = useNavigate();

    // Sidebar.jsx: logout
    const { setAToken } = useContext(AppContext);
    const handleLogout = () => {
    localStorage.removeItem("atoken");
    setAToken("");
    navigate('/')
    };

  return (
    // sticky + h-screen keeps the sidebar in view while the page scrolls
    // flex-col lets the Logout button sit at the bottom with mt-auto
    <aside className="sticky top-0 z-20 flex h-screen w-16 shrink-0 flex-col overflow-y-auto bg-linear-to-b from-[#0B5D3B] to-[#083F29] px-2 py-5 text-white shadow-lg md:w-60 md:px-4 md:py-6">
      {/* Logo + title */}
      <div className="mb-8 flex items-center justify-center gap-2.5 md:justify-start md:px-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ShieldCheck size={18} />
        </div>
        <span className="hidden text-lg font-bold tracking-tight md:inline">
          Admin
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </nav>

      <button
        onClick={handleLogout}
        title="Logout"
        className="mt-auto flex w-full items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white md:justify-start md:px-3"
      >
        <LogOut size={18} className="shrink-0" />
        <span className="hidden md:inline">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
