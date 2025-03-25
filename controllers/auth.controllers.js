import customeError from "../utils/customeError.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password: plain } = req.body;

    // Check if the user already exists (must use session)
    const existingUser = await User.findOne({ email }, null, {
      session: session,
    });
    if (existingUser) {
      return next(new customeError("USER ALREADY EXISTS, PLEASE LOGIN", 409));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plain, 10);

    // Create new user inside the transaction
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session: session } // Correct place for the session option
    );

    // Generate token
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction(); // Commit transaction after success
    // eslint-disable-next-line no-unused-vars
    const { password, ...user } = newUser[0].toObject();

    res.status(201).json({
      success: true,
      user: user,
      token: token,
    });
  } catch (error) {
    await session.abortTransaction(); //  Abort transaction on error
    console.error(error); // Log the error for detailed information
    next(error);
  } finally {
    session.endSession();
  }
};
export const signIn = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new customeError("fill both password and email", 400));
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new customeError("EMAIL NOT FOUND , TRY AGAIN", 404));
  }
  console.log(password, user.password);
  console.log(user);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new customeError("incorrect password", 401));
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  user.password = undefined;
  res.status(200).json({
    success: true,
    user: user,
    token: token,
  });
});
