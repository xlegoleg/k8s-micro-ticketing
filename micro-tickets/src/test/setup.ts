import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global {
  var getAuthCookie: () => string[];
}

jest.mock('../nats', () => ({
  nats: {
    client: {
      publish: jest.fn().mockImplementation(
        (subject: any, data: any, callback: any) => {
          callback();
        }
      )
    }
  },
}));

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

  jest.clearAllMocks();
});

global.getAuthCookie = () => {
  /**
   * Payload
   */
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  /**
   * Creating JWT
   */
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  /**
   * Session cookie mock
   */
  const session = { jwt: token }

  /**
   * Mocking exact base64 value for session cookie
   */
  const base64 = Buffer.from(JSON.stringify(session)).toString('base64');

  return [`session=${base64}`];
}