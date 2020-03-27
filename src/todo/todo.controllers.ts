import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import todoModel from './todo.model';
import mongoose from 'mongoose';

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
  }

  async getAllTodos(req: Request, res: Response) {
    const todos = await todoModel.find();
    return res.json(todos);
  }

  async createTodo(req: Request, res: Response) {
    let todo = new todoModel(req.body);
    await todo.save();
    return res.json(todo);
  }

  async getTodoById(req: Request, res: Response) {
    const id = req.params.id;
    const todo = await todoModel.findById(id);
    return res.json(todo);
  }
}

export default TodosController;
