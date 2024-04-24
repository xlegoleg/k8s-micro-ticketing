import express from 'express';
import 'express-async-errors';
import { json } from  'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { currentUser, errorHandler, NotFoundError } from '@xlegoleg/ticketing-common';
import { newTicketRouter } from './routes/new';
import { getByIdRouter } from './routes/get-by-id';
import { getAllRouter } from './routes/get-all';
import { updateByIdRouter } from './routes/update-by-id';

const DEV_ORIGINS = ['http://localhost:3000'];

const app = express();
/**
 * Trust first proxy
 */
app.use(cors({
  origin: process.env.NODE_ENV !== 'test' || DEV_ORIGINS,
  credentials: true,
}));
/**
 * Trust first proxy
 */
app.set('trust proxy', true);
/**
 * Provides additional property "session" for Request object
 */
app.use(cookieSession({
  signed: false,
  secure: true,
  sameSite: process.env.NODE_ENV !== 'test' ? 'strict' : 'none',
}));
app.use(currentUser);
app.use(json());

/**
 * Routes section
 */
app.use(newTicketRouter);
app.use(getByIdRouter);
app.use(getAllRouter);
app.use(updateByIdRouter);
app.all('*', async () => { throw new NotFoundError() });

/**
 * Common error handler middleware
 */
app.use(errorHandler);

export { app };