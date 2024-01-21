import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.get(
  EPaths.TICKET_BY_ID,
  requireAuth,
  [
    param('id').isLength({ min: 12 }).withMessage('Id should constists of more than 12 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await TicketModel.findById(id);
    
    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
});

export { router as getByIdRouter };