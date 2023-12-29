import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request, 
  res: Response, 
  next: NextFunction  
) => {
  const DEFAULT_MESSAGE = 'Something went wrong...';

  const DEFAULT_STATUS_CODE = 400;

  if (err instanceof CustomError) {
    return res.status(err.STATUS_CODE).send({ errors: err.serializeErrors() });
  }

  res.status(DEFAULT_STATUS_CODE).send({
    message: err.message ?? DEFAULT_MESSAGE,
  });
};