const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/books/:id — devuelve los datos de un libro específico
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            `SELECT 
                libros.id,
                libros.titulo,
                libros.sinopsis,
                libros.portada_url,
                autores.nombre AS autor,
                editoriales.nombre AS editorial
             FROM libros
             JOIN autores ON libros.autor_id = autores.id
             JOIN editoriales ON libros.editorial_id = editoriales.id
             WHERE libros.id = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar el libro' });
    }
});

module.exports = router;