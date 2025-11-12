const express = require('express');
const router = express.Router();
const pool = require('../db');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reportes');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los reportes:', error);
        res.status(500).json({ message: 'Error al obtener los reportes' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion, generado_por } = req.body;

        await pool.query(
            'INSERT INTO reportes (titulo, descripcion, generado_por) VALUES (?, ?, ?)',
            [titulo, descripcion, generado_por || null]
        );

        res.json({ message: 'Reporte guardado correctamente' });
    } catch (error) {
        console.error('Error al guardar el reporte:', error);
        res.status(500).json({ message: 'Error al guardar el reporte' });
    }
});

router.get('/pdf/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            'SELECT r.*, u.nombre AS nombre_usuario FROM reportes r LEFT JOIN usuarios u ON r.generado_por = u.id_usuario WHERE r.id_reporte = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }

        const reporte = rows[0];

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Disposition', `attachment; filename="reporte_${id}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc
            .fontSize(18)
            .text('Sistema de Reportes - A.L.I.N.S.A', { align: 'center' })
            .moveDown();

        doc
            .fontSize(14)
            .text(`Reporte N°: ${reporte.id_reporte}`, { align: 'right' })
            .moveDown(0.5);

        doc
            .fontSize(16)
            .text(reporte.titulo, { underline: true, align: 'left' })
            .moveDown(1);

        doc
            .fontSize(12)
            .text(`Descripción:`, { bold: true })
            .moveDown(0.3);

        doc.text(reporte.descripcion, {
            align: 'justify',
            lineGap: 4
        });

        doc.moveDown(1);

        doc
            .text(`Fecha de generación: ${new Date(reporte.fecha_generacion).toLocaleDateString()}`)
            .text(`Generado por: ${reporte.nombre_usuario || 'Administrador'}`)
            .moveDown(2);

        doc
            .fontSize(10)
            .fillColor('gray')
            .text('Este documento ha sido generado automáticamente por el sistema A.L.I.N.S.A.', {
                align: 'center'
            });

        doc.end();
    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).json({ message: 'Error al generar PDF' });
    }
});

module.exports = router;