import { Document } from 'mongoose';

interface Todo extends Document {
  task: string;
  completed: boolean;
}

export default Todo;
