import { Router } from "express";
import { createSubscription } from "../controllers/subscriptions.controllers.js";
import { protect } from "../middlewares/protect.js";
const subscriptionRouter = Router();
// subscriptionRouter.get("/user/:id", getAllUserSubscriptions);
export default subscriptionRouter;
subscriptionRouter.post("/", protect, createSubscription);
