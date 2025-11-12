const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ALINSA',
    port: process.env.DB_PORT || 3306,
};

router.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const [chequeos] = await connection.execute(`
            SELECT c.id_chequeo, c.estudiante_id, c.fecha, c.peso, c.talla, c.imc, c.observaciones,
                    e.nombre, e.apellido
            FROM chequeos_nutricionales c
            JOIN estudiantes e ON e.id_estudiante = c.estudiante_id
        `);

        await connection.end();

        const alertas = chequeos.filter(ch => ch.imc < 18.5 || ch.imc > 24.9)
            .map(ch => ({
                id_chequeo: ch.id_chequeo,
                estudiante: `${ch.nombre} ${ch.apellido}`,
                fecha: ch.fecha,
                imc: ch.imc,
                mensaje: ch.imc < 18.5 ? "Bajo peso" : "Sobrepeso"
            }));

        res.json(alertas);
    } catch (error) {
        console.error("Error al generar alertas:", error);
        res.status(500).json({ message: "Error al generar alertas" });
    }
});

module.exports = router;