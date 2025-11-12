const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/usuariosLogin'));
app.use('/api/estudiantes', require('./routes/estudiantes'));
app.use('/api/chequeos', require('./routes/chequeos'));
app.use('/api/aulas', require('./routes/aulas'));
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/alertas', require('./routes/alertas'));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});