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
        const [rows] = await connection.execute('SELECT * FROM aulas');
        await connection.end();

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener aulas:", error);
        res.status(500).json({ message: "Error al obtener aulas" });
    }
});

router.post('/', async (req, res) => {
    const { grado, seccion, docente_id } = req.body;

    if (!grado || !seccion) {
        return res.status(400).json({ message: 'Grado y sección son requeridos' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            INSERT INTO aulas (grado, seccion, docente_id)
            VALUES (?, ?, ?)
        `;
        await connection.execute(query, [grado, seccion, docente_id || null]);
        await connection.end();

        res.json({ message: 'Aula creada correctamente' });
    } catch (error) {
        console.error("Error al crear aula:", error);
        res.status(500).json({ message: "Error al crear aula" });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { grado, seccion, docente_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            UPDATE aulas
            SET grado = ?, seccion = ?, docente_id = ?
            WHERE id_aula = ?
        `;
        const [result] = await connection.execute(query, [grado, seccion, docente_id || null, id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aula no encontrada" });
        }

        res.json({ message: 'Aula actualizada correctamente' });
    } catch (error) {
        console.error("Error al actualizar aula:", error);
        res.status(500).json({ message: "Error al actualizar aula" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM aulas WHERE id_aula = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aula no encontrada" });
        }

        res.json({ message: 'Aula eliminada correctamente' });
    } catch (error) {
        console.error("Error al eliminar aula:", error);
        res.status(500).json({ message: "Error al eliminar aula" });
    }
});

module.exports = router;