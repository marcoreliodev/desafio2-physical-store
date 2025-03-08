import 'dotenv/config';
import 'express-async-errors';

import { logger } from './utils/logger';

import AppError from './utils/errors/AppError';

import express, { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from './database/connectionDB';

import { storesRouter } from './routes/stores.routes';

const app = express();

app.use(express.json());

app.use(storesRouter);

connectToDatabase();

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (err instanceof AppError) {
    return void res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return void res.status(500).json({
    status: 'error',
    message: `Internal server error - ${err.message} `,
  });
});

const port = process.env.PORT || 3333;
app.listen(port, () => logger.info(`Server is running on port ${port}.`));
