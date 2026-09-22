// models/donationModel.js
import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [10, "Minimum donation amount is ₹10"],
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      default: null, // filled in only after successful verification
    },
    razorpay_signature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

// Fast lookups for "my donations" and "charity's donors"
DonationSchema.index({ userId: 1, createdAt: -1 });
DonationSchema.index({ charityId: 1, createdAt: -1 });

const DonationModel =
  mongoose.models.donation || mongoose.model("donation", DonationSchema);

export default DonationModel;