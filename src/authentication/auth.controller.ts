import Controller from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import userModel from '../user/user.model';
import jwt from 'jsonwebtoken';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import NotValidCredentialsException from '../exceptions/NotValidCredentialsException';
import bcrypt from 'bcryptjs';
import TokenData from '../interfaces/tokenData.interface';
import AuthenticationService from './auth.service';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  public authentication = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.login);
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });

      if (!user) {
        return next(new NotValidCredentialsException());
      }

      if (user.email === email) {
        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
          return next(new NotValidCredentialsException());
        }
        const { expiresIn, token } = this.authentication.createToken(user);

        res.cookie('Authorization', token, {
          maxAge: expiresIn * 1000,
          httpOnly: true,
        });

        return res.status(200).json(user);
      }
    } catch (error) {
      console.log(error);
      return next(new Error());
    }
  };
}

export default AuthenticationController;
