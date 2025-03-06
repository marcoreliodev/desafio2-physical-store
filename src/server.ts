import 'dotenv/config';
import 'express-async-errors';

import AppError from './errors/AppError';

import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
app.listen(port, () => console.log(`Server is running on port ${port}.`));
