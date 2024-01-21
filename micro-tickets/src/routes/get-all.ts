import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest } from '@xlegoleg/ticketing-common';
import { EPaths } from './constants/paths';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.get(
  EPaths.TICKETS,
  requireAuth,
  async (req: Request, res: Response) => {
    const tickets = await TicketModel.find({});

    res.status(200).send(tickets);
});

export { router as getAllRouter };