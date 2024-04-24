import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, EOrderStatus, NotFoundError, currentUser, requireAuth, validateRequest } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { TicketModel } from '../models/ticket';
import { nats } from '../nats';
import mongoose from 'mongoose';
import { OrderModel } from '../models/order';
import { OrderCreatedPublisher } from '../nats/order-created-publisher';

const EXPIRATION_SECONDS = 15 * 60;

const router = express.Router();

router.post(
  EPaths.ORDERS,
  requireAuth,
  currentUser,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new BadRequestError('Ticket is not found');
    }

    if (await ticket.isReserved()) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    const order = OrderModel.build({
      userId: req.currentUser!.id,
      status: EOrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    await new OrderCreatedPublisher(nats.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: `${order.expiresAt}`,
      ticket: {
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
      },
    })

    res.status(201).send(order);
});

export { router as newOrderRouter};