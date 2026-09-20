import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Gift,
  Heart,
  Trophy,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const mainLinks = [
  { to: "/userhome", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/userhome/scores", label: "My Scores", icon: Target },
  { to: "/userhome/draws", label: "Draws & Rewards", icon: Gift },
  { to: "/userhome/charity", label: "Charity", icon: Heart },
];

const accountLinks = [
  { to: "/userhome/winnings", label: "Winnings", icon: Trophy },
  { to: "/userhome/profile", label: "Profile", icon: User },
  { to: "/userhome/settings", label: "Settings", icon: Settings },
];

const NavItem = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
    title={label}
    className={({ isActive }) =>
      `flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors md:justify-start md:px-3 ${
        isActive
          ? "bg-white/15 font-semibold text-white"
          : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    <Icon size={18} className="shrink-0" />
    <span className="hidden md:inline">{label}</span>
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
    // sticky + h-screen: sidebar stays in view while the page scrolls
    // flex-col: lets the logout button sit at the bottom with mt-auto
    <aside className="sticky top-0 z-20 flex h-screen w-16 shrink-0 flex-col overflow-y-auto bg-[#0B5D3B] px-2 py-5 text-white shadow-lg md:w-60 md:px-4 md:py-6">
      <div className="mb-8 text-center text-lg font-bold tracking-tight md:px-2 md:text-left">
        <span className="md:hidden">DH</span>
        <span className="hidden md:inline">Digital Heroes</span>
      </div>

      <nav className="flex flex-col gap-1">
        {mainLinks.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </nav>

      <nav className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-6">
        {accountLinks.map((link) => (
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
