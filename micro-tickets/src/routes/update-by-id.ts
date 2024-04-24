import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import { NotFoundError, UnauthorizedError, requireAuth, validateRequest } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { TicketModel } from '../models/ticket';
import { TicketUpdatedPublisher } from '../nats/ticket-updated-publisher';
import { nats } from '../nats';

const router = express.Router();

router.put(
  EPaths.TICKET_BY_ID,
  requireAuth,
  [
    param('id').isLength({ min: 12 }).withMessage('Id should constists of more than 12 characters'),
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const ticket = await TicketModel.findById(id);
    
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    ticket.set({
      title,
      price
    });
    await ticket.save();
    await new TicketUpdatedPublisher(nats.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
    });

    res.status(200).send(ticket);
});

export { router as updateByIdRouter };