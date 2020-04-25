import mongoose from 'mongoose';
import Todo from './todo.interface';
import userModel from '../user/user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

todoSchema.pre<Todo>('save', async function (next) {
  try {
    const author = await userModel.findByIdAndUpdate(this.author, {
      $push: { todos: this._id },
    });
    if (!author) {
      return next(new UserNotFoundException(this.author));
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

const todoModel = mongoose.model<Todo>('Todo', todoSchema);

export default todoModel;
