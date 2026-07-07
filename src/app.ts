import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/global-error";
import { notFoundHandler } from "./middlewares/not-found";
// import jwt from "jsonwebtoken";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "GearUp API is running",
  });
});

// app.get("/test-error", (req, res) => {
//   throw new Error("Testing Global Error Handler");
// });

// app.get("/test-jwt", (req, res) => {
//   jwt.verify("invalid-token", "secret");
// });

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;