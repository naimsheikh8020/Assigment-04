import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";

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

export default app;