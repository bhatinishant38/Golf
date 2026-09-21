import jwt from "jsonwebtoken";
import { unlink } from "node:fs/promises";
import { userModel } from "../models/userModel.js";
import charityModel from "../models/charityModel.js";
import { v2 as cloudinary } from "cloudinary";



export const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ success: false, message: "Missing Details" });
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
    const users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Add a new charity — admin only
export const addCharity = async (req, res) => {
  try {
    const { name, category, description, raised, members } = req.body;
    const imageFile = req.file;

    if (
      !name?.trim() ||
      !category?.trim() ||
      !description?.trim() ||
      !imageFile
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, category, description, and image are required",
      });
    }

    // Upload image first
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const charity = await charityModel.create({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      raised: Number(raised) || 0,
      members: Number(members) || 0,
      image: imageUpload.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Charity added",
      charity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Could not add charity",
    });
  }
};

export const getAllCharity =async(req,res)=>{
  try {
    const charities = await charityModel.find()
    res.status(200).json({ success: true, charities });
    
  } catch (error) {
        console.log(error);

    return res.status(500).json({
      success: false,
      message: "Could not get charities",
    });
    
  }
}