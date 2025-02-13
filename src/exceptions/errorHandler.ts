import { NextFunction, Response } from "express";
import { ERROR_MESSAGES } from "../constants/defaultValues";

export function errorHandler(res: Response, error: unknown, statusCode: number): void {
  if (error instanceof Error) {
    res.status(statusCode).send({ error: error.message, statusCode: statusCode });
  } else {
    res.status(statusCode).send({ error: ERROR_MESSAGES.UNKNOWN_ERROR, statusCode: statusCode });
  }
}

const errorHandlers = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || `${ERROR_MESSAGES.SERVER_ERROR_MESSAGE}`;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export default errorHandlers;
