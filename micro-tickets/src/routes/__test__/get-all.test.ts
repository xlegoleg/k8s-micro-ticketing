import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import { nats } from '../../nats';

describe('tests getting all the tickets', () => {
  it(`has a route handler listenning to ${EPaths.TICKETS}`, async () => {
    const response = await request(app)
      .post(EPaths.TICKETS)
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it(`returns list with tickets properly ${EPaths.TICKETS}`, async () => {
    const newResponse = await request(app)
    .post(EPaths.TICKETS)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'test',
      price: 0.333,
    })
    .expect(201);

    const response = await request(app)
      .get(`${EPaths.TICKETS}`)
      .set('Cookie', global.getAuthCookie())
      .send()
      .expect(200);

    expect(response.body.length).not.toEqual(0);
    expect(response.body[0].title).toEqual('test');
    expect(response.body[0].price).toEqual(0.333);
  });
});