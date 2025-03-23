import express from "express";
import { NODE_ENV, PORT } from "./config/env.js";
const app = express();

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} running in ${NODE_ENV} mode`);
});
app.get("/", async (req, res) => {
  console.log("hello world");
});
