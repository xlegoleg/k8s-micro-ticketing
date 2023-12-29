import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';

describe('signout test', () => {
  beforeEach(async () => {
    await global.getAuthCookie();
  });

  it('clears the cookie after signout', async () => {
    const response = await request(app)
      .post(EPaths.SIGNOUT)
      .send({})
      .expect(200);
    
    expect(response.get('Set-Cookie')[0].includes('session=;'));
  });
});