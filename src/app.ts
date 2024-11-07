import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import productRoutes from './routes/product.route';
import protectedProductRoutes from './routes/product.protected.route';
import authRoutes from './routes/auth.route';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import AuthenticationFilter from './middlewares/auth.middleware';
import { config } from './config/config';
import getProducts from './utils/init_data_parser.utils';
import JsonModifier from './utils/json_modifier.utils';
import { UserService } from './services/user.service';

const filter = new AuthenticationFilter();
const app = express();

// Delete existing files
fs.rmSync(config.PRODUCTS_DATA, {force: true});
fs.rmSync(config.USERS_DATA, {force: true});
fs.rmSync(path.resolve(__dirname, config.TEST_LOGS_PATH), {force: true});

(async () => {
  const data = await getProducts();
  const jsonManip = new JsonModifier();

  jsonManip.writeDataToJsonFile(data, config.PRODUCTS_DATA);
  jsonManip.writeDataToJsonFile([], config.USERS_DATA);
})();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Harjot's API",
      version: config.VERSION.toString(),
      description: 'API documentation with JWT authentication',
    },
    servers: [
      {
        url: `https://localhost:${config.PORT}`,
        description: 'Development server (HTTPS)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.route.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve the Swagger documentation UI
app.use(`${config.BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve the Swagger documentation in JSON format
app.get(`${config.BASE_PATH}/docs.json`, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});


app.get('/', (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>Harjot's API</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #eef2f3;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #333;
          }
          h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
          }
          p {
            font-size: 1.2em;
            margin-bottom: 20px;
            color: #555;
            text-align: center;
          }
          a {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
            border: 2px solid #3498db;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background-color 0.3s, color 0.3s;
          }
          a:hover {
            background-color: #3498db;
            color: white;
          }
          footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #777;
          }
        </style>
      </head>
      <body>
        <h1>Bienvenue à mon travail pratique !</h1>
        <p>Pour voir la documentation de l'API, allez à <a href="/api/v1/docs">/api/v1/docs</a></p>
        <footer>
          Dhillon, Harjot Singh (2149861)
        </footer>
      </body>
    </html>
  `);
});

app.use(config.BASE_PATH, productRoutes);
app.use(config.BASE_PATH, authRoutes);

app.use(config.BASE_PATH, filter.authAndAuthorizeManager, protectedProductRoutes);

app.use(errorMiddleware);

export default app;