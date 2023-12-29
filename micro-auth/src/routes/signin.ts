import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { UserModel } from '../models/user';
import { PasswordService } from '../services/password';
import { EPaths } from './constants/paths';

const router = express.Router();

router.post(
  EPaths.SIGNIN,
  [ 
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user || !PasswordService.compare(user.password, password)) {
      throw new BadRequestError('Invalid credentials');
    }

    req.session = {
      jwt: jwt.sign({
        id: user.id,
        email: user.email,
      }, process.env.JWT_SECRET!),
    };

    res.status(200).send(user);
});

export { router as signinRouter};