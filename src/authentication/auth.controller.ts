import Controller from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import userModel from '../user/user.model';
import jwt from 'jsonwebtoken';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import NotValidCredentialsException from '../exceptions/NotValidCredentialsException';
import bcrypt from 'bcryptjs';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.login);
  }

  private async login(req: Request, res: Response, next: NextFunction) {
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
        let token;

        jwt.sign(
          {user},
          `${process.env.JWT_SECRET}`,
          { expiresIn: '60d' },
          (err, token) => {
            if (err) {
              console.log(err)
              return next(new Error());
            }
            return res.status(200).json(token);
          }
        );
      } else {
        return next(new NotValidCredentialsException());
      }
    } catch (error) {
      return next(new Error());
    }
  }
}

export default AuthenticationController;
