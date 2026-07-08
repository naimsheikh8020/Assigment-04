import  { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

export const catchAsync = (fn: Function)=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
            await fn(req, res, next);
        } 
        catch (error) {
        console.log(error);

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to register user",
            error: (error as Error).message
        })

    }
}
}