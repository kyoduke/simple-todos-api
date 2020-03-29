import mongoose from 'mongoose';
import Todo from './todo.interface';

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
});

const todoModel = mongoose.model<Todo>('Todo', todoSchema);

export default todoModel;
