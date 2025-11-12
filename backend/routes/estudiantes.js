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
        const [rows] = await connection.execute(`
            SELECT e.id_estudiante, e.nombre, e.apellido, e.dni, e.edad,
                    e.aula_id, e.docente_id
            FROM estudiantes e
        `);
        await connection.end();

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        res.status(500).json({ message: "Error al obtener estudiantes" });
    }
});

router.post('/', async (req, res) => {
    const { nombre, apellido, dni, edad, aula_id, docente_id } = req.body;

    if (!nombre || !apellido) {
        return res.status(400).json({ message: 'Nombre y apellido son requeridos' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            INSERT INTO estudiantes (nombre, apellido, dni, edad, aula_id, docente_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(query, [nombre, apellido, dni || null, edad || null, aula_id || null, docente_id || null]);
        await connection.end();

        res.json({ message: 'Estudiante creado correctamente' });
    } catch (error) {
        console.error("Error al crear estudiante:", error);
        res.status(500).json({ message: "Error al crear estudiante" });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, edad, aula_id, docente_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            UPDATE estudiantes
            SET nombre = ?, apellido = ?, dni = ?, edad = ?, aula_id = ?, docente_id = ?
            WHERE id_estudiante = ?
        `;
        const [result] = await connection.execute(query, [nombre, apellido, dni, edad, aula_id, docente_id, id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        res.json({ message: 'Estudiante actualizado correctamente' });
    } catch (error) {
        console.error("Error al actualizar estudiante:", error);
        res.status(500).json({ message: "Error al actualizar estudiante" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM estudiantes WHERE id_estudiante = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        res.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        res.status(500).json({ message: "Error al eliminar estudiante" });
    }
});

module.exports = router;