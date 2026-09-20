import mongoose from "mongoose";
 
// How many months each plan lasts
const planMonths = {
  basic: 1,
  pro: 12,
};
 
// Returns the date a plan ends, counting from `from` (today by default).
// Example: basic starting 31 Jan ends 28 Feb (not 3 Mar).
export const getPlanEndDate = (plan, from = new Date()) => {
  const end = new Date(from);
  const day = end.getDate();
 
  end.setMonth(end.getMonth() + planMonths[plan]);
 
  // If the month was shorter (31 Jan + 1 month), JavaScript rolls into the next month.
  // Step back to the last day of the month we wanted.
  if (end.getDate() !== day) end.setDate(0);
 
  return end;
};
 
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
    subscriptionEnd: { type: Date }, // set automatically, see the hook below
 
    charity: { type: String, required: true, trim: true },
 
    image: { type: String, default: "" },
    gender: { type: String, default: "Not selected" },
    dob: { type: Date },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);
 
// Runs before every save(). When a user is created or their plan changes,
// set the end date: basic = 1 month from now, pro = 1 year from now.
userSchema.pre("save", function () {
  if (this.isNew || this.isModified("subscriptionPlan")) {
    this.subscriptionEnd = getPlanEndDate(this.subscriptionPlan);
  }
});
 
export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);