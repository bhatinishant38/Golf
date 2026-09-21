import express from "express";
import { addCharity, adminLogin, getAllCharity, getAllUsers } from "../controllers/adminContoller.js";
import { authAdmin } from "../Middleware/Authadmin.js";
import { upload } from "../Middleware/multer.js";


export const adminRouter = express.Router()

adminRouter.post('/login',adminLogin)
adminRouter.get("/users", authAdmin, getAllUsers);
adminRouter.post("/add-charity", authAdmin, upload.single("image"), addCharity);
adminRouter.get('/get-charities',authAdmin,getAllCharity)