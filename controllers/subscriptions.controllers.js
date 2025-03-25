import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import Subscription from "./../models/subscription.model.js";
import customeError from "../utils/customeError.js";
export const createSubscription = asyncErrorHandler(async (req, res, next) => {
  if (!req.body) {
    return next(new customeError("body not provided", 400));
  }
  const sub = { ...req.body, user: req.user._id };

  const subscription = await Subscription.create(sub);
  res.status(200).json({
    success: true,
    subscription,
  });
});
