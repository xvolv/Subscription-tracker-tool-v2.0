import { Router } from "express";
import { getAllUserSubscriptions } from "../controllers/subscriptions.controllers.js";
const subscriptionRouter = Router();
subscriptionRouter.get("/user/:id", getAllUserSubscriptions);
export default subscriptionRouter;
