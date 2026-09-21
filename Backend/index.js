import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDatabase } from "./Config/db.js";
import { userRouter } from "./Routes/userRoutes.js";

import { adminRouter } from "./Routes/adminRouter.js";
import { connectCloudinary } from "./Config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";


//app config
const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(cors());

//db connection
connectDatabase();
connectCloudinary();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res, next) => {
  res.send("API WORKING GOOD");
});
app.listen(PORT, () => {
  console.log(`App working on http://localhost:${PORT}`);
});
