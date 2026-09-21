import express from "express";
import { adminLogin } from "../controllers/adminContoller.js";


export const adminRouter = express.Router()

adminRouter.post('/login',adminLogin)