import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import { EOrderStatus, NotFoundError, UnauthorizedError, requireAuth, validateRequest } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { OrderModel } from '../models/order';

const router = express.Router();

router.put(
  EPaths.ORDER_BY_ID,
  requireAuth,
  [
    param('id').isLength({ min: 12 }).withMessage('Id should constists of more than 12 characters'),
    body('status')
      .not()
      .isEmpty()
      .custom((input: EOrderStatus) => Object.values(EOrderStatus).includes(input))
      .withMessage('Status is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await OrderModel.findById(id);
    
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    order.set({ status });
    await order.save();

    res.status(200).send(order);
});

export { router as updateByIdRouter };