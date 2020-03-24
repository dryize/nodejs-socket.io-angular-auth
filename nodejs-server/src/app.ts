import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from "http";
import SocketIO  from "socket.io";
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import logger from 'morgan';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import ChatService from './services/chat.service';

class App {
  public app: express.Application;
  public io: SocketIO.Server;
  public port: (string | number);
  public env: boolean;
  private chat: ChatService;

  constructor(routes: Routes[]) {
    this.app = express();
    this.io = SocketIO.listen();
    this.chat = new ChatService(this.io);

    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV === 'production' ? true : false;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    const http = this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
    this.io.attach(http)
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else {
      this.app.use(logger('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private async connectToDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;
    const options = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

    await mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?authSource=admin`, { ...options });
    console.log('Connected to Mongo DB');
  }
}

export default App;
