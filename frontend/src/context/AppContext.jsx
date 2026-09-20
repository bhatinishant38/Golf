import { createContext, useState } from "react";

export const AppContext = createContext();




export function AppContextProvider({ children }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || false,
  );

  const value = {
    backendUrl,
    token,
    setToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
