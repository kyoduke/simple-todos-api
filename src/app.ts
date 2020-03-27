import express, { urlencoded } from 'express';
import Controller from './interfaces/controller.interface';
import mongoose from 'mongoose';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(process.env.PORT || 3333, () => {
      console.log(`App listening on the port ${process.env.PORT || 3333}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD } = process.env;
    mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-c140d.gcp.mongodb.net/simple-todos?retryWrites=true&w=majority`,
      { useUnifiedTopology: true, useNewUrlParser: true },
      error => {
        error ? console.log(error) : console.log('Database connected!');
      }
    );
  }
}

export default App;
