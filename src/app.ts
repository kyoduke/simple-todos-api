import express from 'express';
import Controller from './interfaces/controller.interface';
import mongoose from 'mongoose';
import errorMiddleware from './middlewares/error.middleware';
import env from './utils/cleanedEnv';
const cookieParser = require('cookie-parser');

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(env.PORT || 3333, () => {
      console.log(`App listening on the port ${env.PORT || 3333}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD } = env;
    mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-c140d.gcp.mongodb.net/simple-todos?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      },
      (error) => {
        error ? console.log(error) : console.log('Database connected!');
      }
    );
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
