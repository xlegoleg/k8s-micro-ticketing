import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';

describe('signup test', () => {
  beforeEach(async () => {
    await global.getAuthCookie();
  });

  it('fails when an email that not exists was supplied', async () => {
    await request(app)
      .post(EPaths.SIGNIN)
      .send({ 
        email: 'test@test.ru',
        password: 'test1234',
      })
      .expect(400);
  });

  it('fails when a wrong password was supplied', async () => {
    await request(app)
      .post(EPaths.SIGNIN)
      .send({ 
        email: 'test@test.com',
        password: 'test4321',
      })
      .expect(400);
  });

  it('responds with a cookie with valid credentials', async () => {
    const response = await request(app)
      .post(EPaths.SIGNIN)
      .send({ 
        email: 'test@test.com',
        password: 'test1234',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});