import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, subscriptionPlan, charity } = req.body;
    if (!email || !name || !password || !subscriptionPlan || !charity) {
      return res.json({ success: false, message: "Enter your details" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const exists = await userModel
      .findOne({ email: normalizedEmail })
      .select("password");
    if (exists) {
      return res.json({ success: false, message: "Email already registered" });
    }

    if (!validator.isEmail(normalizedEmail)) {
      return res.json({ success: false, message: "Enter correct email" });
    }

    if (password.length <= 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      subscriptionPlan,
      charity,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Enter your details" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter correct email" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel
      .findOne({ email: normalizedEmail })
      .select("password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
