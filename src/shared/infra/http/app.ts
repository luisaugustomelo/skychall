import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { NextFunction, Response, Request } from 'express';
import helmet from 'helmet';

import AppError from '@shared/errors/AppError';
import '@shared/infra/typeorm';

import '@shared/container';
import '@modules/users/providers';

import routes from './routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(routes);

app.use(
    express.json({
        limit: '100kb',
        strict: true,
        type: 'application/json',
    }),
);
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // eslint-disable-next-line
    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

export default app;
