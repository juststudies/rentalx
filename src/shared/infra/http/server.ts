import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import '@shared/infra/typeorm';
import '@shared/container';
import { router } from '@shared/infra/http/routes';

import swagerFile from '../../../swagger.json';
import { AppErrors } from '@shared/errors/AppErrors';
const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagerFile));
app.use(router);
app.use((err: Error, request: Request, response: Response, next: NextFunction)=>{
    if(err instanceof AppErrors){
        return response.status(err.statusCode).json({
            message: err.message
        });
    }
    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    });
});

app.listen(3333);