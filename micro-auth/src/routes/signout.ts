import express, { Request, Response } from 'express';
import { EPaths } from './constants/paths';

const router = express.Router();

router.post(EPaths.SIGNOUT, (req: Request, res: Response) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter};