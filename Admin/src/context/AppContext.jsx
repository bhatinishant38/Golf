import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [charities ,setCharities] = useState([])

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

const fetchCharities = async () => {
  try {
    const { data } = await axios.get(
      backendUrl + "/api/admin/get-charities",
      {
        headers: { atoken },
      }
    );
    if (data.success) {
      setCharities(data.charities);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error.message);
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
    fetchCharities,
    charities ,
    setCharities
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
