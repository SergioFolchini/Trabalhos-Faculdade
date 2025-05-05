const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes'); // Importa as rotas

const app = express();
const port = 3000;

// Configuração do Swagger melhorada
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API APAE',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
      contact: {
        name: "Equipe de Desenvolvimento",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rota com documentação
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(express.json());

// Configuração do CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Rotas
app.use('/api', routes); // Usa as rotas importadas

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css'
}));

// Rota simples
app.get('/', (req, res) => {
  res.send('API da APAE funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger: http://localhost:${port}/api-docs`);
});