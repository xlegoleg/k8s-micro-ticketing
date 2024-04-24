import request from 'supertest';
import { app } from '../../app';
import { EPaths } from '../constants/paths';

let authCookie: any;

describe('current-user test', () => {
  beforeEach(async () => {
    authCookie = await global.getAuthCookie();
  });

  it('responds with details about current user', async () => {
    const response = await request(app)
      .get(EPaths.CURRENT_USER)
      .set('Cookie', authCookie)
      .send()
      .expect(200);
    
    expect(response.body.currentUser.email).toEqual('test@test.com');
  });

  it('responds with null if user is unauthorized', async () => {
    const response = await request(app)
      .get(EPaths.CURRENT_USER)
      .send()
      .expect(401);
    
    expect(response.body.currentUser).toEqual(undefined);
  });
});