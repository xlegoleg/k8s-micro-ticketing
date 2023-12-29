import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { EPaths } from './constants/paths';

const router = express.Router();

router.post(
  EPaths.SIGNUP,
  [
    body('email').isEmail().withMessage('Email must have a valid format'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (await UserModel.findOne({ email })) {
    throw new BadRequestError(`Email in use ${email}`);
  }

  const user = UserModel.build({ email, password });
  await user.save();

  req.session = {
    jwt: jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_SECRET!),
  }

  res.status(201).send(user);
});

export { router as signupRouter};