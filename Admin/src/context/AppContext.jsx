import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [atoken, setAToken] = useState(
    () => localStorage.getItem("atoken") || "",
  );

  const loadusers = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/users", {
        headers: { atoken },
      });
      if (data.success) {
        console.log(data.users);
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token missing or expired: send the admin back to the login page
        localStorage.removeItem("atoken");
        setAToken("");
      } else {
        toast.error(error.response?.data?.message || "Could not load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    backendUrl,
    setAToken,
    atoken,
    setLoading,
    loading,
    loadusers,
    users,
    setUsers,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
