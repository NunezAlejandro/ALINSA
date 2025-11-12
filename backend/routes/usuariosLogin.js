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

router.post('/login', async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
            [correo, password]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        const usuario = rows[0];

        res.json({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol
        });

    } catch (error) {
        console.error("Error al verificar login:", error);
        res.status(500).json({ message: "Error al conectar con la base de datos" });
    }
});

module.exports = router;