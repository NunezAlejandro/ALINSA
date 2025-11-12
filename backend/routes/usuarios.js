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
        const [rows] = await connection.execute('SELECT * FROM usuarios');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

router.post('/', async (req, res) => {
    const { nombre, apellido, correo, contrasena, rol } = req.body;
    if (!nombre || !apellido || !correo || !contrasena || !rol) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?)`;
        await connection.execute(query, [nombre, apellido, correo, contrasena, rol]);
        await connection.end();
        res.json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear usuario" });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, contrasena, rol } = req.body;
    if (!nombre || !apellido || !correo || !contrasena || !rol) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `UPDATE usuarios SET nombre=?, apellido=?, correo=?, contrasena=?, rol=? WHERE id_usuario=?`;
        const [result] = await connection.execute(query, [nombre, apellido, correo, contrasena, rol, id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error al actualizar usuario" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`DELETE FROM usuarios WHERE id_usuario=?`, [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error("Error al borrar usuario:", error);
        res.status(500).json({ message: "Error al borrar usuario" });
    }
});

module.exports = router;