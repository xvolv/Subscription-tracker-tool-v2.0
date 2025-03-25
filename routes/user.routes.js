import { Router } from "express";
import { getUsers, getUser } from "../controllers/users.controllers.js";
import { protect } from "../middlewares/protect.js";

const userRouter = Router();
userRouter.get("/", protect, getUsers);
userRouter.get("/:id", protect, getUser);
export default userRouter;
