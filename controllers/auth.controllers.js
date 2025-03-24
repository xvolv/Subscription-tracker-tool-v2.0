import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import User from "../models/user.model.js";
export const signUp = asyncErrorHandler(async (req, res, next) => {
  const user = await User.create();

  res.status(201).json({
    success: true,
    user,
  });
});
