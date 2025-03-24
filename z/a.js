import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import customError from "../utils/customeError.js";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
export const signUp = async (req, res, next) => {
  //create session
  const session = await mongoose.startSession();
  //start transaction
  session.startTransaction();
  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email }, null, {
      session: session,
    });
    if (existingUser) {
      return next(new customError("USER ALREADY EXIST, PLEASE TRY LOGIN", 409));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create([
      { email, name, password: hashedPassword },
      { session: session },
    ]);
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await session.commitTransaction();
    res.status(201).json({
      success: true,
      user: newUser,
      token: token,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }

  //group session when you perfom database operation

  //commit transaction or abort it
  //end session
};
