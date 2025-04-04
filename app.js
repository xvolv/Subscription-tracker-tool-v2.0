import express from "express";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import { NODE_ENV, PORT } from "./config/env.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import globalErrorHandler from "./middlewares/globalErrorHandlerMiddleware.js";
import workflowRouter from "./routes/workflowRouter.js";

const app = express();
app.use(express.json());

app.use("/api/v2/users", userRouter);
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/subscriptions", subscriptionRouter);
app.use("/api/v2/workflows", workflowRouter);
app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} running in ${NODE_ENV} mode`);
  connectToDatabase();
});
