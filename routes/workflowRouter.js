import { Router } from "express";
import { sendReminder } from "../controllers/workflow.controller";
const workflowRouter = Router();
workflowRouter.get("/", sendReminder);

export default workflowRouter;
