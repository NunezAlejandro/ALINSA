const connection = require('../db');

exports.getAulas = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM aulas');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.createAula = async (req, res) => {
    const { grado, seccion, docente_id } = req.body;
    try {
        const [result] = await connection.query(
            'INSERT INTO aulas (grado, seccion, docente_id) VALUES (?, ?, ?)',
            [grado, seccion, docente_id || null]
        );
        res.json({ message: 'Aula creada', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.updateAula = async (req, res) => {
    const { id } = req.params;
    const { grado, seccion, docente_id } = req.body;
    try {
        await connection.query(
            'UPDATE aulas SET grado=?, seccion=?, docente_id=? WHERE id_aula=?',
            [grado, seccion, docente_id || null, id]
        );
        res.json({ message: 'Aula actualizada' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.deleteAula = async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query('DELETE FROM aulas WHERE id_aula=?', [id]);
        res.json({ message: 'Aula eliminada' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};