import { useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

 
const [atoken, setAToken] = useState(() => localStorage.getItem("atoken") || "");


    
  const value = {
    setAToken,atoken
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
