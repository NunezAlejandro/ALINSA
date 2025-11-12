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
            SELECT c.id_chequeo, c.estudiante_id, c.salud_id, c.fecha, c.peso, c.talla, c.imc, c.observaciones,
                    e.nombre AS nombre_estudiante, e.apellido AS apellido_estudiante
            FROM chequeos_nutricionales c
            JOIN estudiantes e ON c.estudiante_id = e.id_estudiante
            ORDER BY c.fecha DESC
        `);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener chequeos:", error);
        res.status(500).json({ message: "Error al obtener chequeos" });
    }
});

router.get('/ultimo/:estudiante_id', async (req, res) => {
    const { estudiante_id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT * FROM chequeos_nutricionales
            WHERE estudiante_id = ?
            ORDER BY fecha DESC
            LIMIT 1
        `, [estudiante_id]);
        await connection.end();
        if (rows.length === 0) return res.status(404).json({ message: "No se encontró chequeo" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener último chequeo:", error);
        res.status(500).json({ message: "Error al obtener último chequeo" });
    }
});

router.post('/', async (req, res) => {
    const { estudiante_id, salud_id, fecha, peso, talla, imc, observaciones } = req.body;
    if (!estudiante_id || !fecha || !peso || !talla) {
        return res.status(400).json({ message: 'Estudiante, fecha, peso y talla son obligatorios' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            INSERT INTO chequeos_nutricionales 
            (estudiante_id, salud_id, fecha, peso, talla, imc, observaciones) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(query, [estudiante_id, salud_id || null, fecha, peso, talla, imc, observaciones]);
        await connection.end();
        res.json({ message: 'Chequeo registrado correctamente' });
    } catch (error) {
        console.error("Error al crear chequeo:", error);
        res.status(500).json({ message: "Error al crear chequeo" });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { estudiante_id, salud_id, fecha, peso, talla, imc, observaciones } = req.body;

    if (!estudiante_id || !fecha || !peso || !talla) {
        return res.status(400).json({ message: 'Estudiante, fecha, peso y talla son obligatorios' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            UPDATE chequeos_nutricionales
            SET estudiante_id=?, salud_id=?, fecha=?, peso=?, talla=?, imc=?, observaciones=?
            WHERE id_chequeo=?
        `;
        const [result] = await connection.execute(query, [estudiante_id, salud_id || null, fecha, peso, talla, imc, observaciones, id]);
        await connection.end();

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Chequeo no encontrado' });
        res.json({ message: 'Chequeo actualizado correctamente' });
    } catch (error) {
        console.error("Error al actualizar chequeo:", error);
        res.status(500).json({ message: "Error al actualizar chequeo" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`DELETE FROM chequeos_nutricionales WHERE id_chequeo=?`, [id]);
        await connection.end();

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Chequeo no encontrado' });
        res.json({ message: 'Chequeo eliminado correctamente' });
    } catch (error) {
        console.error("Error al borrar chequeo:", error);
        res.status(500).json({ message: "Error al borrar chequeo" });
    }
});

module.exports = router;