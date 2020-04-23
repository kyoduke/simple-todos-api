import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from './user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import mongoose from 'mongoose';

class userController implements Controller {
  public path = '/users';
  public router = Router();

  constructor() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createUser);
    this.router.get(`${this.path}/:id`, this.getUserById);
  }

  // CREATE
  private async createUser(req: Request, res: Response) {
    const user = new userModel(req.body);
    try {
      await user.save();
      const response = user.toObject();
      delete response.password;
      delete response.__v;
      delete response.email;

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // READ
  private async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userModel.find().select('-__v -password -email');
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  private async getUserById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return next(new UserNotFoundException(id));
      }
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return next(new UserNotFoundException(id));
      }
      return res.status(500).json(error);
    }
  }
}

// UPDATE



// DELETE
export default userController;
