import 'dotenv/config';
import App from './app';
import TodoController from './todo/todo.controllers';
import validateEnv from './utils/validateEnv';
import userController from './user/user.controller';

validateEnv();

const app = new App([new TodoController(), new userController()]);

app.listen();
