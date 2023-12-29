import mongoose from 'mongoose';
import { app } from './app';

/**
 * App start function, put there all needed
 */
const start = async () => {
  const envs = ['JWT_SECRET'];

  envs.forEach((v) => {
    if (!process.env[v]) {
      throw new Error(`${v} must be defined`);
    }
  });

  try {
    await mongoose.connect('mongodb://micro-auth-mongo-srv:27017/auth');
    console.log('Successfuly conneced to db');
  } catch (err) {
    console.error('Error connecting mongodb', err);
  }

  app.listen(3000, () => {
    console.log('App is listenning on 3000');
  });
} 

start();