import mongoose from 'mongoose';
import Todo from './todo.interface';

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
});

const todoModel = mongoose.model<Todo>('Todo', todoSchema);

export default todoModel;
