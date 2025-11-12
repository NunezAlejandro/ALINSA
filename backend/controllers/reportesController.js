const connection = require('../db');

exports.getReportes = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM reportes');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.createReporte = async (req, res) => {
    const { titulo, descripcion, generado_por } = req.body;
    try {
        const [result] = await connection.query(
            'INSERT INTO reportes (titulo, descripcion, generado_por) VALUES (?, ?, ?)',
            [titulo, descripcion, generado_por || null]
        );
        res.json({ message: 'Reporte creado', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.updateReporte = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    try {
        await connection.query(
            'UPDATE reportes SET titulo=?, descripcion=? WHERE id_reporte=?',
            [titulo, descripcion, id]
        );
        res.json({ message: 'Reporte actualizado' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.deleteReporte = async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query('DELETE FROM reportes WHERE id_reporte=?', [id]);
        res.json({ message: 'Reporte eliminado' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};