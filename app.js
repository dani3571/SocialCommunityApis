const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
bodyParser = require("body-parser"),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");

// Middleware para analizar el cuerpo de la solicitud POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS
app.use(cors());

// Importar las rutas desde user.js
const userRoutes = require('./routes/user.js');

// Usar las rutas importadas
app.use('/', userRoutes);

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Express API with Swagger  - SOCIAL COMMUNITYS",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
      },
      tags: [
        {
            name: 'Usuarios',
        }
      ],
      servers: null    
},
    apis: ["./routes/user.js"],
    defaultTag: 'Usuarios'
  };
  
  const specs = swaggerJsdoc(options);
  
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );
  
  

app.listen(8080, () => {
    console.log("Servidor corriendo en el puerto 8000");
});

module.exports = app;