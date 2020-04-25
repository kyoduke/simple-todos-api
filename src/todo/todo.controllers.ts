import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import todoModel from './todo.model';
import mongoose from 'mongoose';
import TodoNotFoundException from '../exceptions/TodoNotFoundException';
import Todo from './todo.interface';
import UserNotFoundException from '../exceptions/UserNotFoundException';

class TodosController implements Controller {
  public path = '/todos';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllTodos);
    this.router.post(this.path, this.createTodo);
    this.router.get(`${this.path}/:id`, this.getTodoById);
    this.router.put(`${this.path}/:id`, this.updateTodo);
    this.router.delete(`${this.path}/:id`, this.deleteTodo);
  }

  // CREATE
  private async createTodo(req: Request, res: Response, next: NextFunction) {
    const createdTodo = new todoModel(req.body);

    try {
      await createdTodo.save();
      return res.status(201).json(createdTodo);
    } catch (error) {
      if (error.errors.author) {
        return next(new UserNotFoundException(req.body.author));
      }
      return next(error);
    }
  }

  // READ
  private async getAllTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await todoModel.find().populate('author');
      return res.status(200).json(todos);
    } catch (error) {
      return next(error);
    }
  }

  private async getTodoById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    try {
      const todo = await todoModel.findById(id).populate('author');

      if (!todo) {
        return next(new TodoNotFoundException(id));
      }
      return res.status(200).json(todo);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return next(new TodoNotFoundException(id));
      }
      return next(error);
    }
  }

  // UPDATE
  private async updateTodo(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const updatedTodo: Todo = req.body;

    try {
      const todo = await todoModel.findByIdAndUpdate(id, updatedTodo, {
        new: true,
      });

      if (!todo) {
        return next(new TodoNotFoundException(id));
      }
      return res.status(200).json(todo);
    } catch (error) {
      return next(error);
    }
  }

  // DELETE
  private async deleteTodo(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    try {
      const todo = await todoModel.findByIdAndDelete(id);

      if (!todo) {
        return next(new TodoNotFoundException(id));
      }
      return res.status(200).send();
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return next(new TodoNotFoundException(id));
      }
      return next(error);
    }
  }
}

export default TodosController;
