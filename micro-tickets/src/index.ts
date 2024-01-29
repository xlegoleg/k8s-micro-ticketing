import mongoose from 'mongoose';
import { app } from './app';
import { connectNatsClient } from './nats';

/**
 * App start function, put there all needed
 */
const start = async () => {
  const envs: string[] = ['MICRO_TICKETS_MONGO_URL'];

  envs.forEach((v) => {
    if (!process.env[v]) {
      throw new Error(`${v} must be defined`);
    }
  });

  try {
    await connectNatsClient({
      clusterId: 'ticketing',
      clientId: 'micro-tickets',
      url: process.env.NATS_STREAMING_URL!,
    });
    await mongoose.connect(process.env.MICRO_TICKETS_MONGO_URL!);
    console.log('Successfuly conneced to db');
  } catch (err) {
    console.error('Error connecting mongodb', err);
  }

  app.listen(3000, () => {
    console.log('App is listenning on 3000');
  });
} 

start();