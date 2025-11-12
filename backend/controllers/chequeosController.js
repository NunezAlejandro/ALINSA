const connection = require('../db');

exports.getChequeos = (req, res) => {
    const { estudiante_id, aula_id, mes } = req.query;
    let sql = 'SELECT * FROM chequeos_nutricionales';
    const params = [];
    const conditions = [];

    if (estudiante_id) conditions.push('estudiante_id=?') && params.push(estudiante_id);
    if (aula_id) conditions.push('aula_id=?') && params.push(aula_id);
    if (mes) conditions.push('MONTH(fecha)=?') && params.push(mes);

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');

    connection.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.getUltimoChequeo = (req, res) => {
    const { estudiante_id } = req.params;
    const sql = 'SELECT * FROM chequeos_nutricionales WHERE estudiante_id=? ORDER BY fecha DESC LIMIT 1';
    connection.query(sql, [estudiante_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0] || null);
    });
};

exports.createChequeo = (req, res) => {
    const { estudiante_id, salud_id, fecha, peso, talla, imc, observaciones } = req.body;
    const sql = 'INSERT INTO chequeos_nutricionales (estudiante_id, salud_id, fecha, peso, talla, imc, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [estudiante_id, salud_id, fecha, peso, talla, imc, observaciones], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Chequeo registrado', id: result.insertId });
    });
};

exports.updateChequeo = (req, res) => {
    const { id } = req.params;
    const { fecha, peso, talla, imc, observaciones } = req.body;
    const sql = 'UPDATE chequeos_nutricionales SET fecha=?, peso=?, talla=?, imc=?, observaciones=? WHERE id_chequeo=?';
    connection.query(sql, [fecha, peso, talla, imc, observaciones, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Chequeo actualizado' });
    });
};

exports.deleteChequeo = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM chequeos_nutricionales WHERE id_chequeo=?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Chequeo eliminado' });
    });
};