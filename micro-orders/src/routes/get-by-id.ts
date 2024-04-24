import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { NotFoundError, UnauthorizedError, requireAuth, validateRequest } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { OrderModel } from '../models/order';

const router = express.Router();

router.get(
  EPaths.ORDER_BY_ID,
  requireAuth,
  [
    param('id').isLength({ min: 12 }).withMessage('Id should constists of more than 12 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await OrderModel.findById(id).populate('ticket');
    
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    res.status(200).send(order);
});

export { router as getByIdRouter };