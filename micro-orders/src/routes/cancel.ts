import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import { EOrderStatus, NotFoundError, UnauthorizedError, requireAuth, validateRequest } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { OrderModel } from '../models/order';
import { OrderCancelledPublisher } from '../nats/order-cancelled-publisher';
import { nats } from '../nats';

const router = express.Router();

router.put(
  EPaths.CANCEL_ORDER,
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

    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    order.set({ status: EOrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(nats.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      }
    })

    res.status(200).send(order);
});

export { router as updateByIdRouter };