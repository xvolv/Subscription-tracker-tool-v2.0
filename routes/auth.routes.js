import { Router } from "express";
import { signUp } from "../controllers/auth.controllers.js";
const authRouter = Router();
authRouter.get("/sign-up", signUp);
export default authRouter;
