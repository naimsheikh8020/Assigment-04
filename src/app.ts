import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";

import routes from "../routes/index.js";
import { globalErrorHandler } from "./middlewares/global-error.js";
import { notFoundHandler } from "./middlewares/not-found.js";

const app: Application = express();

// Parse Request Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse Cookies
app.use(cookieParser());

// API Routes
app.use("/api/v1", routes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "GearUp API is running",
  });
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
