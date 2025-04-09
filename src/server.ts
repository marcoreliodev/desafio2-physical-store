import 'dotenv/config';
import 'express-async-errors';

import morgan from 'morgan';
import { logger } from './utils/logger';

import AppError from './utils/errors/AppError';
import { HttpStatusCode } from './stores/StoresController';

import express, { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from './database/connectionDB';

import { storesRouter } from './routes/stores.routes';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(storesRouter);

connectToDatabase();

if (!process.env.VIACEP_API_URL) {
  throw new Error('VIACEP_API_URL is not defined');
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (err instanceof AppError) {
    return void res.status(err.statusCode).json({
      status: 'error',
      code: err.statusCode,
      message: err.message,
    });
  }

  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = isDevelopment 
  ? `Internal Server Error - ${err.message}`
  : 'Internal Server Error - An unexpected error occurred. Please try again later';

  return void res.status(500).json({
    status: 'error',
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: errorMessage,
  });
});

const port = process.env.PORT || 3333;
app.listen(port, () => logger.info(`Server is running on port ${port}.`));
