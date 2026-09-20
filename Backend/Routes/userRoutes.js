import express from "express";
import multer from "multer";
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import { authUser } from "../middleware/authUser.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, multer().single("image"), updateProfile);
