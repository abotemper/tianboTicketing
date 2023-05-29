import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError  } from '@tiantianwuqing/common';
import { User } from '../models/user';


const router = express.Router();

router.post('/api/users/signup', [
  body('email')
     .isEmail()
     .withMessage('email must be valid'),
  body('password')
     .trim()
     .isLength({ min: 4, max: 20 })
     .withMessage('password must be between 4 and 20 characters')
    
], validateRequest ,
async(req: Request, res: Response) => {
 const { email, password } = req.body;

 const existingUser = await User.findOne({ email });
 if (existingUser) {
  throw new BadRequestError('Email in use!');
  // console.log('Email in use');
  // return res.send({});
 }

 const user = User.build({ email, password });
 await user.save();

 //generate jwt
const userJwt = jwt.sign(
  {
    id: user.id,
    email: user.email
  }, 
  process.env.JWT_KEY!
  );//!用来取消type的考察

 //store jwt on session object
req.session = {
  jwt: userJwt
};

 res.status(201).send(user);
 // new user ({ email, password })
});

export { router as signupRouter };