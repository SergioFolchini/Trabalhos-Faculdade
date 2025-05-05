const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');

// Importação das rotas
const usuariosRoutes = require('./routes/usuariosRoutes');
const profissionaisRoutes = require('./routes/professionalsRoutes');
const professoresRoutes = require('./routes/teachersRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const eventsRoutes = require('./routes/eventsRoutes');

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Configuração das rotas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/consultas', appointmentsRoutes);
app.use('/api/eventos', eventsRoutes);

// Configuração do Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "APIs Integradas - WEB-II 2025.01",
      version: "1.0.0",
      description: `### Projetos da Equipe  
            
            **Equipe**: Sergio, Lemuel, Rodrigo, Enzo, Bruno  
            **Disciplina**: WEB-2 2025.01  
            
            ## Módulos Disponíveis  
            1. **Usuários** - API de gestão de usuários  
            2. **Profissionais** - API de profissionais de saúde  
            3. **Professores** - API de professores  
            4. **Estudantes** - API de estudantes  
            5. **Consultas** - API de consultas  
            6. **Eventos** - API de eventos escolares`

    },
    servers: [{ url: "http://localhost:3000/api", description: 'Servidor Local' }],
  },
  apis: [path.join(__dirname, './routes/*.js')], // Caminho absoluto para os arquivos de rotas
});

// Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
  explorer: true,
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css'
}));

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});