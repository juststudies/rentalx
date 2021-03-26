import express from 'express';
import swaggerUi from 'swagger-ui-express';

import './database';
import './shared/container';
import { router } from './routes';
import swagerFile from './swagger.json';
const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagerFile));
app.use(router);

app.listen(3333);