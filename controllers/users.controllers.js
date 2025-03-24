import User from "../models/user.model.js";
// import customeError from "../utils/customeError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import customeError from "../utils/customeError.js";

export const getUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find({});
  console.log(users);
  res.status(200).json({
    success: true,
    users,
  });
});
export const getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new customeError("no user found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
