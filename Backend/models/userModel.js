import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },

    subscriptionPlan: {
      type: String,
      enum: ["basic", "pro"],
      required: true,
    },
    subscriptionEnd: { type: Date },

    charity: { type: String, required: true, trim: true },

    image: { type: String, default: "" },
    gender: { type: String, default: "Not selected" },
    dob: { type: Date },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);