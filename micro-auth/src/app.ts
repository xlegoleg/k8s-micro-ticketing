import express from 'express';
import 'express-async-errors';
import { json } from  'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { errorHandler, NotFoundError } from '@xlegoleg/ticketing-common';
import { currentUserRouter } from './routes/current-user';
import { signinRouter  } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter  } from './routes/signup';

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
app.use(json());

/**
 * Routes section
 */
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all('*', async () => { throw new NotFoundError() });

/**
 * Common error handler middleware
 */
app.use(errorHandler);

export { app };