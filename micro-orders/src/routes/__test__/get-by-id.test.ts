import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import mongoose from 'mongoose';
import { TicketModel } from '../../models/ticket';

const mockTicket = async () => {
  const ticket = TicketModel.build({
    title: 'test',
    price: 0.5
  });
  await ticket.save();
  return ticket;
}

describe('tests getting by id of order', () => {
  it(`returns 404 with non-existing order using ${EPaths.ORDER_BY_ID}`, async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`${EPaths.ORDERS}/${id}`)
      .set('Cookie', global.getAuthCookie())
      .send()
      .expect(404);
  });

  it(`returns 401 if user asks order which doesn't belong to him ${EPaths.ORDER_BY_ID}`, async () => {
    const ticket = await mockTicket();
    const firstUserId = global.getAuthCookie();
    const secondUserId = global.getAuthCookie();

    const order = await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', firstUserId)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`${EPaths.ORDERS}/${order.body.id}`)
      .set('Cookie', secondUserId)
      .expect(401);
  });

  it(`returns an existing order ${EPaths.ORDER_BY_ID}`, async () => {
    const ticket = await mockTicket();
    const userId = global.getAuthCookie();

    const order = await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', userId)
      .send({ ticketId: ticket.id })
      .expect(201);

    const response = await request(app)
      .get(`${EPaths.ORDERS}/${order.body.id}`)
      .set('Cookie', userId)
      .send()
      .expect(200);

    expect(response.body.ticket.title).toEqual('test');
    expect(response.body.ticket.price).toEqual(0.5);
  });
})