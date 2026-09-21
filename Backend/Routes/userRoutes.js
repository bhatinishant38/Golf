import express from "express";
import { authUser } from "../middleware/authUser.js";
import { upload } from "../Middleware/multer.js";

import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import { addScore, deleteScore,  getScores, updateScore } from "../controllers/scoreController.js";


export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, upload.single('image'), updateProfile);

userRouter.get("/get-scores", authUser, getScores);
userRouter.post("/add-score", authUser, addScore);
userRouter.post("/update-score/:id", authUser, updateScore);
userRouter.delete("/delete-score/:id", authUser, deleteScore);

