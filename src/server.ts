import 'dotenv/config';
import App from './app';
import TodoController from './todo/todo.controllers';
import userController from './user/user.controller';
import AuthenticationController from './authentication/auth.controller';


const app = new App([
  new TodoController(),
  new userController(),
  new AuthenticationController(),
]);

app.listen();
