import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import mongoose from 'mongoose';

describe('tests getting by id of ticket', () => {
  it(`returns 404 with non-existing ticket using ${EPaths.TICKET_BY_ID}`, async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`${EPaths.TICKETS}/${id}`)
      .set('Cookie', global.getAuthCookie())
      .send()
      .expect(404);
  });

  it(`returns an existing ticket ${EPaths.TICKET_BY_ID}`, async () => {
    const newResponse = await request(app)
    .post(EPaths.TICKETS)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'test',
      price: 0.333,
    })
    .expect(201);

    const response = await request(app)
      .get(`${EPaths.TICKETS}/${newResponse.body.id}`)
      .set('Cookie', global.getAuthCookie())
      .send()
      .expect(200);

    expect(response.body.title).toEqual('test');
    expect(response.body.price).toEqual(0.333);
  });
})