const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/recommendations — un usuario envía una recomendación
router.post('/', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'Debes iniciar sesión para recomendar un libro' });
    }

    const { titulo_libro, autor_libro, motivo } = req.body;

    if (!titulo_libro || !motivo) {
        return res.status(400).json({ error: 'Faltan datos de la recomendación' });
    }

    try {
        const resultado = await pool.query(
            `INSERT INTO recomendaciones (usuario_id, titulo_libro, autor_libro, motivo)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.session.usuario.id, titulo_libro, autor_libro, motivo]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar la recomendación' });
    }
});

module.exports = router;