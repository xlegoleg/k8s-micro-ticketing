import mongoose from 'mongoose';
import { app } from './app';

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