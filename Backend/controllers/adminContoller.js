import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

export const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
        res.json({success:false ,message:"Missing Details"})
    }
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const atoken = jwt.sign(email + password, process.env.JWT_SECRET_KEY);
      res.json({ success: true, atoken });
    } else {
      res.json({ success: false, message: "Invalid Credantials" });
    }
  } catch (error) {
    // console.log(error)
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/users   (all users, newest first, without passwords)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password").sort({ createdAt: -1 });
 
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};