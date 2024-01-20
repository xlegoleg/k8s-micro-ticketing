import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export interface IUserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  const currentUserJwt = req.session?.jwt;

  if (!currentUserJwt) {
    return next();
  }

  try {
    const currentUser = jwt.verify(currentUserJwt, process.env.JWT_SECRET!) as IUserPayload;
    req.currentUser = currentUser;
  } catch (e) {
    console.error(e);
  }

  next();
};