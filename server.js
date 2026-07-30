const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Ruta de prueba: confirma que Node y PostgreSQL se están comunicando
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ conectado: true, hora_servidor: result.rows[0].now });
    } catch (error) {
        console.error(error);
        res.status(500).json({ conectado: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});