import express from "express";
import { adminLogin, getAllUsers } from "../controllers/adminContoller.js";
import { authAdmin } from "../Middleware/Authadmin.js";


export const adminRouter = express.Router()

adminRouter.post('/login',adminLogin)
adminRouter.get("/users", authAdmin, getAllUsers);