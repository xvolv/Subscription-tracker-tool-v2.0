/* eslint-disable no-undef */
import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

export const { NODE_ENV, PORT, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;
