import express, { Request, Response } from 'express';
import { currentUser, requireAuth } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { OrderModel } from '../models/order';

const router = express.Router();

router.get(
  EPaths.ORDERS,
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const orders = await OrderModel.find({
      userId: req.currentUser!.id,
    }).populate('ticket');

    res.status(200).send(orders);
});

export { router as getAllRouter };