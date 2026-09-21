import mongoose from "mongoose";

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    raised: {
      type: Number,
      required: true,
      default: 0,
    },
    members: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true,
      // store the image URL (e.g. from your upload/storage service)
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const charityModel =
  mongoose.models.charity || mongoose.model("charity", charitySchema);

export default charityModel;