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
  reforestation: "Reforestation Project",
  "mental-health": "Mental Health Support",
  "youth-mentorship": "Youth Mentorship",
  "ocean-cleanup": "Ocean Cleanup Initiative",
  "rural-clinic": "Rural Health Clinic",
};

// Score routes in one place. Change these if your backend routes are named differently.
const scoreRoutes = {
  list: "/api/user/get-scores", // GET
  add: "/api/user/add-score", // POST   body: { date, score }
  update: "/api/user/update-score", // PUT    /:id  body: { date, score }
  remove: "/api/user/delete-score", // DELETE /:id
};

export function AppContextProvider({ children }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // "" means logged out (always a string, so we never mix false and "")
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [profileData, setProfileData] = useState(null);
  const [scores, setScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(true);

  // One place to handle failed requests:
  // a 401 means the token is missing or expired, so log the user out.
  const handleApiError = useCallback((error, fallbackMessage) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      setToken("");
      setProfileData(null);
      setScores([]);
      // toastId stops the same message showing twice when two requests fail together
      toast.error("Your session has expired. Please log in again.", {
        toastId: "session-expired",
      });
    } else {
      toast.error(error.response?.data?.message || fallbackMessage);
    }
  }, []);

  // ---- Profile ----

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
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
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

  // ---- Scores ----

  // Load the user's latest 5 scores (newest first)
  const getScores = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + scoreRoutes.list, {
        headers: { token },
      });

      if (data.success) {
        setScores(data.scores);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error, "Could not load your scores");
    } finally {
      setScoresLoading(false);
    }
  }, [backendUrl, token, handleApiError]);

  // Runs an add / update / delete request, then reloads the scores.
  // Returns true if it worked, false if not.
  const runScoreRequest = async (request, successMessage, errorMessage) => {
    try {
      const { data } = await request();

      if (data.success) {
        toast.success(data.message || successMessage);
        await getScores(); // the list on screen updates from here
        return true;
      }

      toast.error(data.message);
      return false;
    } catch (error) {
      handleApiError(error, errorMessage);
      return false;
    }
  };

  const addScore = ({ date, score }) =>
    runScoreRequest(
      () => axios.post(backendUrl + scoreRoutes.add, { date, score }, { headers: { token } }),
      "Score added",
      "Could not add the score",
    );

  const updateScore = (id, { date, score }) =>
    runScoreRequest(
      () => axios.put(`${backendUrl}${scoreRoutes.update}/${id}`, { date, score }, { headers: { token } }),
      "Score updated",
      "Could not update the score",
    );

  const deleteScore = (id) =>
    runScoreRequest(
      () => axios.delete(`${backendUrl}${scoreRoutes.remove}/${id}`, { headers: { token } }),
      "Score deleted",
      "Could not delete the score",
    );

  // When the user logs in, load their data. When they log out, clear it.
  // (Pages no longer need to fetch anything themselves.)
  useEffect(() => {
    if (token) {
      getUserProfile();
      getScores();
    } else {
      setProfileData(null);
      setScores([]);
      setScoresLoading(false);
    }
  }, [token, getUserProfile, getScores]);

  const value = {
    backendUrl,
    token,
    setToken,
    profileData,
    setProfileData,
    getUserProfile,
    updateProfile,
    charityNames,
    scores,
    setScores,
    scoresLoading,
    getScores,
    addScore,
    updateScore,
    deleteScore,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
