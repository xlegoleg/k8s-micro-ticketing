import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import mongoose from 'mongoose';
import { EOrderStatus } from '@xlegoleg/ticketing-common';
import { TicketModel } from '../../models/ticket';

const mockTicket = async () => {
  const ticket = TicketModel.build({
    title: 'test',
    price: 0.5
  });
  await ticket.save();
  return ticket;
}

describe('tests updating by id of ticket', () => {
  it(`returns 404 with non-existing ticket using ${EPaths.ORDER_BY_ID}`, async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`${EPaths.ORDERS}/${id}`)
      .set('Cookie', global.getAuthCookie())
      .send({ status: EOrderStatus.Cancelled })
      .expect(404);
  });

  it('return 401 if the order is not belongs to user', async () => {
    const ticket = await mockTicket();
    const firstUserId = global.getAuthCookie();
    const secondUserId = global.getAuthCookie();

    const order = await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', firstUserId)
      .send({ ticketId: ticket.id })

    await request(app)
      .put(`${EPaths.ORDERS}/${order.body.id}`)
      .set('Cookie', secondUserId)
      .send({ status: EOrderStatus.Cancelled })
      .expect(401);
  });

  it(`updating an existing ticket ${EPaths.ORDER_BY_ID}`, async () => {
    const ticket = await mockTicket();
    const userId = global.getAuthCookie();

    const order = await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', userId)
      .send({ ticketId: ticket.id })
      .expect(201);

    const response = await request(app)
      .put(`${EPaths.ORDERS}/${order.body.id}`)
      .set('Cookie', userId)
      .send({ status: EOrderStatus.Cancelled })
      .expect(200);

    expect(response.body.status).toEqual(EOrderStatus.Cancelled);
  });
})