const express = require("express");
const router = express.Router(); // Utiliza Router en lugar de crear una nueva instancia de Express

const dotenv = require("dotenv");
dotenv.config();

//conexión con la base de datos
const { connection } = require("../config.db");

const getUser = (request, response) => {
    connection.query("SELECT * FROM user", (error, results) => {
        if (error)
            throw error;
        response.status(200).json(results);
    });
};


// Definir la ruta en el enrutador
router.get("/", (req, res) => {
    res.send("Bienvenido a la página principal");
});

router.get("/user", getUser);


// Exportar el enrutador para que pueda ser utilizado por la aplicación principal
module.exports = router;