import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { AppContext } from "../context/AppContext";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100";

const AdminLogin = () => {
  const { backendUrl, setAToken } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/admin/login", {
        email: email.trim(),
        password,
      });

      if (data.success) {
        localStorage.setItem("atoken", data.atoken);
        setAToken(data.atoken); // App.jsx sees the token and shows the admin pages
        toast.success("Welcome back!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
       console.error(error); // open the browser console (F12) to see the real reason
        if (error.response) {
          toast.error(error.response.data?.message || `Server error (${error.response.status})`);
        } else if (error.request) {
          toast.error("Can't reach the server. Is the backend running?");
        } else {
          toast.error(error.message);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7F5] px-4">
      <div className="w-full max-w-sm">

        {/* Logo and title */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#0B5D3B] text-white">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage the platform.</p>
        </div>

        {/* Form card */}
        <form
          onSubmit={onSubmitHandler}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoComplete="username"
            required
            className={`${inputClass} mb-4`}
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0B5D3B] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#094d31] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
