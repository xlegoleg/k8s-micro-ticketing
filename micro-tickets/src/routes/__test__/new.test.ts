import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import { TicketModel } from '../../models/ticket';
import { nats } from '../../nats';

describe('tests creating new ticket', () => {
  it(`has a route handler listenning to ${EPaths.TICKETS}`, async () => {
    const response = await request(app)
      .post(EPaths.TICKETS)
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app)
      .post(EPaths.TICKETS)
      .send({})
      .expect(401);
  });
  
  it('returns an error if invalid inputs were provided', async () => {
    await request(app)
      .post(EPaths.TICKETS)
      .set('Cookie', global.getAuthCookie())
      .send({
        title: null,
        price: 10000
      })
      .expect(400);

    await request(app)
      .post(EPaths.TICKETS)
      .set('Cookie', global.getAuthCookie())
      .send({
        title: 'dsadasd',
      })
      .expect(400);
  });

  it('creates a ticket with valid inputs', async () => {
    let tickets = await TicketModel.find({})
    expect(tickets.length).toEqual(0);

    await request(app)
      .post(EPaths.TICKETS)
      .set('Cookie', global.getAuthCookie())
      .send({
        title: 'test',
        price: 0.333,
      })
      .expect(201);

    tickets = await TicketModel.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(0.333);
    expect(tickets[0].title).toEqual('test');
  });

  it('publishes an event', async () => {
    let tickets = await TicketModel.find({})
    expect(tickets.length).toEqual(0);

    await request(app)
      .post(EPaths.TICKETS)
      .set('Cookie', global.getAuthCookie())
      .send({
        title: 'test',
        price: 0.333,
      })
      .expect(201);

    expect(nats.client.publish).toHaveBeenCalled();
  });
})