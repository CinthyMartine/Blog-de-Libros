const express = require('express');
const router = express.Router();
const pool = require('../db');
const { contieneLenguajeInapropiado } = require('../utils/filtro-palabras');

// GET /api/comments/:bookId — trae todos los comentarios de un libro
router.get('/:bookId', async (req, res) => {
    const { bookId } = req.params;

    try {
        const resultado = await pool.query(
            `SELECT 
                comentarios.id,
                comentarios.texto,
                comentarios.fecha,
                usuarios.nombre AS usuario
             FROM comentarios
             JOIN usuarios ON comentarios.usuario_id = usuarios.id
             WHERE comentarios.libro_id = $1
             ORDER BY comentarios.fecha DESC`,
            [bookId]
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
});

// POST /api/comments — guarda un comentario nuevo
router.post('/', async (req, res) => {
    const { texto, libro_id, usuario_id } = req.body;

    if (!texto || !libro_id || !usuario_id) {
        return res.status(400).json({ error: 'Faltan datos del comentario' });
    }

    // Revisar lenguaje inapropiado
    if (contieneLenguajeInapropiado(texto)) {
    return res.status(400).json({ error: 'Tu comentario contiene lenguaje no permitido' });
}

    try {
        const resultado = await pool.query(
            `INSERT INTO comentarios (texto, libro_id, usuario_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [texto, libro_id, usuario_id]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el comentario' });
    }
});

module.exports = router;