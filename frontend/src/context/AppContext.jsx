import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

// Charity ids saved on the user -> names to show.
// (Same ids as your Charity page, so both pages can use this one list.)
const charityNames = {
  "clean-water": "Clean Water for All",
  "education-for-all": "Education for All",
  "save-environment": "Save the Environment",
  "health-wellness": "Health & Wellness",
  "food-bank": "Community Food Bank",
  "literacy-kids": "Literacy for Kids",
  "reforestation": "Reforestation Project",
  "mental-health": "Mental Health Support",
  "youth-mentorship": "Youth Mentorship",
  "ocean-cleanup": "Ocean Cleanup Initiative",
  "rural-clinic": "Rural Health Clinic",
};

export function AppContextProvider({ children }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // "" means logged out (always a string, so we never mix false and "")
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [profileData, setProfileData] = useState(null);

  // One place to handle failed requests:
  // a 401 means the token is missing or expired, so log the user out.
  const handleApiError = useCallback((error, fallbackMessage) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      setToken("");
      setProfileData(null);
      toast.error("Your session has expired. Please log in again.");
    } else {
      toast.error(error.response?.data?.message || fallbackMessage);
    }
  }, []);

  // Load the logged-in user's profile
  const getUserProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (data.success) {
        setProfileData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error, "Could not load your profile");
    }
  }, [backendUrl, token, handleApiError]);

  // Save profile changes. Returns true if it worked, false if not.
  // `formData` holds name, phone, gender, dob and an optional image file.
  const updateProfile = async (formData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message || "Profile updated");
        await getUserProfile(); // reload the saved data
        return true;
      }

      toast.error(data.message);
      return false;
    } catch (error) {
      handleApiError(error, "Could not update your profile");
      return false;
    }
  };

  // Load the profile when the user logs in, clear it when they log out.
  // (Pages no longer need to fetch it themselves.)
  useEffect(() => {
    if (token) {
      getUserProfile();
    } else {
      setProfileData(null);
    }
  }, [token, getUserProfile]);

  const value = {
    backendUrl,
    token,
    setToken,
    profileData,
    setProfileData,
    getUserProfile,
    updateProfile,
    charityNames,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
