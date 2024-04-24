import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import { TicketModel } from '../../models/ticket';
import { nats } from '../../nats';
import mongoose from 'mongoose';
import { OrderModel } from '../../models/order';
import { EOrderStatus } from '@xlegoleg/ticketing-common';

const ticketId = new mongoose.Types.ObjectId().toHexString();

const mockTicket = async () => {
  const ticket = TicketModel.build({
    title: 'test',
    price: 0.5
  });
  await ticket.save();
  return ticket;
}

describe('tests creating new order', () => {
  it(`has a route handler listenning to ${EPaths.ORDERS}`, async () => {
    const response = await request(app)
      .post(EPaths.ORDERS)
      .send({ ticketId });

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app)
      .post(EPaths.ORDERS)
      .send({})
      .expect(401);
  });
  
  it('returns not found if there is no ticket', async () => {
    await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', global.getAuthCookie())
      .send({ ticketId })
      .expect(400);
  });

  it('returns an error if the ticket is already reserved', async () => {
    const ticket = await mockTicket();
    const order = OrderModel.build({
      ticket,
      userId: 'test',
      status: EOrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', global.getAuthCookie())
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it('creates an order with valid input', async () => {
    const ticket = await mockTicket();

    await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', global.getAuthCookie())
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it.todo('emits an event after success');
})