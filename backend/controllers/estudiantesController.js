const connection = require('../db');

exports.getEstudiantes = (req, res) => {
    const { docente_id } = req.query;
    let sql = 'SELECT * FROM estudiantes';
    const params = [];
    if (docente_id) {
        sql += ' WHERE docente_id=?';
        params.push(docente_id);
    }
    connection.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.createEstudiante = (req, res) => {
    const { nombre, apellido, dni, edad, aula_id, docente_id } = req.body;
    const sql = 'INSERT INTO estudiantes (nombre, apellido, dni, edad, aula_id, docente_id) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [nombre, apellido, dni, edad, aula_id, docente_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Estudiante creado', id: result.insertId });
    });
};

exports.updateEstudiante = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, edad, aula_id, docente_id } = req.body;
    const sql = 'UPDATE estudiantes SET nombre=?, apellido=?, dni=?, edad=?, aula_id=?, docente_id=? WHERE id_estudiante=?';
    connection.query(sql, [nombre, apellido, dni, edad, aula_id, docente_id, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Estudiante actualizado' });
    });
};

exports.deleteEstudiante = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM estudiantes WHERE id_estudiante=?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Estudiante eliminado' });
    });
};