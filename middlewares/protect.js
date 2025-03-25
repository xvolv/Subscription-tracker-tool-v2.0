import customeError from "../utils/customeError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { JWT_SECRET } from "./../config/env.js";
export const protect = asyncErrorHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  const token =
    header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return next(new customeError("not autorized", 401));
  }
  //verrify token
  let check;

  check = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(check.userId);
  if (!user) {
    return next(new customeError("user not found", 404));
  }

  req.user = user;
  console.log(req.user);
  next();
});
