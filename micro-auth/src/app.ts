import express from 'express';
import 'express-async-errors';
import { json } from  'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter  } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter  } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
/**
 * Trust first proxy
 */
app.set('trust proxy', true);
/**
 * Provides additional property "session" for Request object
 */
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
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