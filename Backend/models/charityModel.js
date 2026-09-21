import mongoose from "mongoose";

const charitySchema = new mongoose.Schema(
    {

    }
)

export const charityModel =
  mongoose.models.score || mongoose.model("charity", charitySchema);