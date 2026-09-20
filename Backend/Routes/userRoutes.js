import express from "express";
import { authUser } from "../middleware/authUser.js";
import { upload } from "../Middleware/multer.js";

import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";


export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, upload.single('image'), updateProfile);
