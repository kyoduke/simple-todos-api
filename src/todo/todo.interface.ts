import { Document } from 'mongoose';

interface Todo extends Document {
  task: string;
  completed: boolean;
  author: string;
}

export default Todo;
