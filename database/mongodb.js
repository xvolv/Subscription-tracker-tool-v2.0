import mongoose from "mongoose";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDatabase = asyncErrorHandler(async () => {
  await mongoose.connect(DB_URI);
  console.log(`connected to databse in ${NODE_ENV} mode`);
});
export default connectToDatabase;
