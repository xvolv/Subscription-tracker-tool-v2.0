import customeError from "../utils/customeError.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists (must use session)
    const existingUser = await User.findOne({ email }, null, { session });
    if (existingUser) {
      return next(new customeError("USER ALREADY EXISTS, PLEASE LOGIN", 409));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user inside the transaction
    const newUser = await User.create(
      {
        name,
        email,
        password: hashedPassword,
      },
      { session }
    );

    // Generate token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction(); // Commit transaction after success

    res.status(201).json({
      success: true,
      user: newUser,
      token: token,
    });
  } catch (error) {
    await session.abortTransaction(); // Abort transaction on error
    next(error);
  } finally {
    session.endSession();
  }
};
