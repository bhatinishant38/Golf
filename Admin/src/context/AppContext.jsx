import { useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [atoken, setAToken] = useState(
    () => localStorage.getItem("atoken") || "",
  );

  const value = {
    backendUrl,
    setAToken,
    atoken,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
