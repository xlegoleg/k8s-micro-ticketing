import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { EPaths } from '../routes/constants/paths';

let mongo: any;

declare global {
  var getAuthCookie: () => Promise<string[]>
}

beforeAll(async () => {
  process.env.JWT_SECRET = 'asdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.getAuthCookie = async () => {
  const email = 'test@test.com';
  const password = 'test1234';

  const response = await request(app)
    .post(EPaths.SIGNUP)
    .send({ 
      email: 'test@test.com',
      password: 'test1234',
    })
    .expect(201);

  return response.get('Set-Cookie');
}