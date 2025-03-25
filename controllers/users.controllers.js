import arcjet, { tokenBucket } from "@arcjet/node";
import User from "../models/user.model.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import customeError from "../utils/customeError.js";
import { ARCJET_KEY } from "../config/env.js";

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export const getUsers = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id.toString(); // Extract userId from req.user
  const decision = await aj.protect(req, { userId, requested: 1 }); // Adjust requested

  if (decision.isDenied()) {
    return res.status(429).json({
      success: false,
      message: "Too Many Requests",
      reason: decision.reason,
    });
  }

  const users = await User.find({});
  res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id.toString(); // Extract userId from req.user
  const decision = await aj.protect(req, { userId, requested: 1 }); // Adjust requested

  if (decision.isDenied()) {
    return res.status(429).json({
      success: false,
      message: "Too Many Requests",
      reason: decision.reason,
    });
  }

  const userFromParams = await User.findById(req.params.id);

  if (req.user._id.toString() !== req.params.id) {
    return next(new customeError(`wrong request`, 400));
  }

  if (!userFromParams) {
    return next(new customeError("no user found", 404));
  }
  res.status(200).json({
    success: true,
    userFromParams,
  });
});
