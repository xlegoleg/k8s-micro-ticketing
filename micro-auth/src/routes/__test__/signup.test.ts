import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';

describe('signup test', () => {
  it('returns 201 on successful signup', async () => {
    await request(app)
      .post(EPaths.SIGNUP)
      .send({ 
        email: 'test@test.com',
        password: 'test1234',
      })
      .expect(201);
  });

  it('returns 400 on invalid password or email', async () => {
    await request(app)
      .post(EPaths.SIGNUP)
      .send({ 
        email: 'test@testtest',
        password: 'test1234',
      })
      .expect(400);

    await request(app)
      .post(EPaths.SIGNUP)
      .send({ 
        email: 'test@test.com',
        password: 'te',
      })
      .expect(400);
  });

  it('disallows using duplicated emails', async () => {
    await request(app)
      .post(EPaths.SIGNUP)
      .send({ 
        email: 'test@test.com',
        password: 'test1234',
      })
      .expect(201);

    await request(app)
      .post(EPaths.SIGNUP)
      .send({ 
        email: 'test@test.com',
        password: 'test1234',
      })
      .expect(400);
  });

  it('sets a cookie after succesfull signup', async () => {
    const response = await request(app)
      .post(EPaths.SIGNUP)
      .send({ 
        email: 'test@test.com',
        password: 'test1234',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});