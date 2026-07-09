import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js"; // or "@prisma/client"
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err);

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let name = "Error";
  let errors: unknown = undefined;

  if (err instanceof Error) {
    message = err.message;
    name = err.name;
  }
  if (err instanceof AppError) {
  statusCode = err.statusCode;
}
  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Invalid data provided.";
  }

  // Prisma Known Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = StatusCodes.BAD_REQUEST;
        message = `Duplicate value for ${String(err.meta?.target)}`;
        break;

      case "P2003":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Foreign key constraint failed.";
        break;

      case "P2025":
        statusCode = StatusCodes.NOT_FOUND;
        message = "Requested resource not found.";
        break;

      default:
        statusCode = StatusCodes.BAD_REQUEST;
        message = err.message;
    }
  }

  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    switch (err.errorCode) {
      case "P1000":
        statusCode = StatusCodes.UNAUTHORIZED;
        message = "Database authentication failed.";
        break;

      case "P1001":
        statusCode = StatusCodes.SERVICE_UNAVAILABLE;
        message = "Cannot connect to the database server.";
        break;

      default:
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = err.message;
    }
  }

  // Prisma Unknown Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Unknown database error occurred.";
  }

  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed.";

    errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // JWT Invalid Token
  else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid token.";
  }

  // JWT Expired Token
  else if (err instanceof jwt.TokenExpiredError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Token has expired.";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    name,
    message,
    errors,
    stack:
      process.env.NODE_ENV === "development"
        ? err instanceof Error
          ? err.stack
          : undefined
        : undefined,
  });
};