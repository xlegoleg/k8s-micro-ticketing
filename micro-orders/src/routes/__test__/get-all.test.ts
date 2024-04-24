import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import { TicketModel } from '../../models/ticket';

const ticketId = new mongoose.Types.ObjectId().toHexString();

const mockTicket = async () => {
  const ticket = TicketModel.build({
    title: 'test',
    price: 0.5
  });
  await ticket.save();
  return ticket;
}

describe('tests getting all the orders', () => {
  it(`has a route handler listenning to ${EPaths.ORDERS}`, async () => {
    const response = await request(app)
      .get(EPaths.ORDERS)
      .send();

    expect(response.status).not.toEqual(404);
  });

  it(`returns list with orders properly ${EPaths.ORDERS}`, async () => {
    const ticketOne = await mockTicket();
    const ticketTwo = await mockTicket();
    const ticketThree = await mockTicket();

    const userOne = global.getAuthCookie();
    const userTwo = global.getAuthCookie();

    await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201);

   await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo.id })
      .expect(201);

    await request(app)
      .post(EPaths.ORDERS)
      .set('Cookie', userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    const responseOne = await request(app)
      .get(`${EPaths.ORDERS}`)
      .set('Cookie', userOne)
      .send()
      .expect(200);

    const responseTwo = await request(app)
      .get(`${EPaths.ORDERS}`)
      .set('Cookie', userTwo)
      .send()
      .expect(200);


    expect(responseOne.body.length).toEqual(1);
    expect(responseTwo.body.length).toEqual(2);
  });
});