const connection = require('../db');

exports.getUsuarios = (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.createUsuario = (req, res) => {
    const { nombre, apellido, correo, contrasena, rol } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nombre, apellido, correo, contrasena, rol], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario creado', id: result.insertId });
    });
};

exports.updateUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, rol, estado } = req.body;
    const sql = 'UPDATE usuarios SET nombre=?, apellido=?, correo=?, rol=?, estado=? WHERE id_usuario=?';
    connection.query(sql, [nombre, apellido, correo, rol, estado, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario actualizado' });
    });
};

exports.deleteUsuario = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM usuarios WHERE id_usuario=?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario eliminado' });
    });
};

exports.updatePassword = (req, res) => {
    const { id } = req.params;
    const { contrasena } = req.body;
    connection.query('UPDATE usuarios SET contrasena=? WHERE id_usuario=?', [contrasena, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Contraseña actualizada' });
    });
};