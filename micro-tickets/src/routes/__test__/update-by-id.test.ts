import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';
import mongoose from 'mongoose';
import { nats } from '../../nats';

describe('tests updating by id of ticket', () => {
  it(`returns 404 with non-existing ticket using ${EPaths.TICKET_BY_ID}`, async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`${EPaths.TICKETS}/${id}`)
      .set('Cookie', global.getAuthCookie())
      .send({
        title: 'test1',
        price: 0.444,
      })
      .expect(404);
  });

  it('return 401 if the user is not owns a ticket', async () => {
    const newResponse = await request(app)
    .post(EPaths.TICKETS)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'test',
      price: 0.333,
    })

    await request(app)
      .put(`${EPaths.TICKETS}/${newResponse.body.id}`)
      .set('Cookie', global.getAuthCookie())
      .send({
        title: 'test1',
        price: 0.444
      })
      .expect(401);
  });


  it('return 400 if invalid data provided', async () => {
    const cookie = global.getAuthCookie();
    const newResponse = await request(app)
    .post(EPaths.TICKETS)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 0.333,
    })

    await request(app)
      .put(`${EPaths.TICKETS}/${newResponse.body.id}`)
      .set('Cookie', cookie)
      .send({
        price: -0.444
      })
      .expect(400);
  });

  it(`updating an existing ticket ${EPaths.TICKET_BY_ID}`, async () => {
    const cookie = global.getAuthCookie();
    const newResponse = await request(app)
    .post(EPaths.TICKETS)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 0.333,
    })
    .expect(201);

    const response = await request(app)
      .put(`${EPaths.TICKETS}/${newResponse.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'test1',
        price: 0.444
      })
      .expect(200);

    expect(response.body.title).toEqual('test1');
    expect(response.body.price).toEqual(0.444);
  });

  it(`updating an existing ticket ${EPaths.TICKET_BY_ID}`, async () => {
    const cookie = global.getAuthCookie();
    const newResponse = await request(app)
    .post(EPaths.TICKETS)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 0.333,
    })
    .expect(201);

    const response = await request(app)
      .put(`${EPaths.TICKETS}/${newResponse.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'test1',
        price: 0.444
      })
      .expect(200);

    expect(nats.client.publish).toHaveBeenCalled();
  });
})