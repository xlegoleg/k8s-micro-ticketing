import mongoose from 'mongoose';
import { app } from './app';
import { connectNatsClient } from './nats';

/**
 * App start function, put there all needed
 */
const start = async () => {
  const envs: string[] = [
    'JWT_SECRET',
    'MICRO_ORDERS_MONGO_URL',
    'NATS_STREAMING_CLUSTER_ID',
    'NATS_STREAMING_CLIENT_ID',
    'NATS_STREAMING_URL'
  ];

  envs.forEach((v) => {
    if (!process.env[v]) {
      throw new Error(`${v} must be defined`);
    }
  });

  try {
    await connectNatsClient({
      clusterId: process.env.NATS_STREAMING_CLUSTER_ID!,
      clientId: process.env.NATS_STREAMING_CLIENT_ID!,
      url: process.env.NATS_STREAMING_URL!,
    });
    await mongoose.connect(process.env.MICRO_ORDERS_MONGO_URL!);
    console.log('Successfuly conneced to db');
  } catch (err) {
    console.error('Error connecting mongodb', err);
  }

  app.listen(3000, () => {
    console.log('App is listenning on 3000');
  });
} 

start();