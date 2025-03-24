import { Router } from "express";
import { getUsers, getUser } from "../controllers/users.controllers.js";

const userRouter = Router();
userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
export default userRouter;
