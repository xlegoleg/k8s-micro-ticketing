import express, { Request, Response } from 'express';
import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';
import { EPaths } from './constants/paths';

const router = express.Router();

router.get(EPaths.CURRENT_USER, currentUser, requireAuth, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };