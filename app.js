const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

// Middleware para analizar el cuerpo de la solicitud POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar las rutas desde user.js
const userRoutes = require('./routes/user.js');

// Usar las rutas importadas
app.use('/', userRoutes);

app.listen(8080, () => {
    console.log("Servidor corriendo en el puerto 8000");
});

module.exports = app;