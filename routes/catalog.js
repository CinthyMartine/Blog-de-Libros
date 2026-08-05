const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/genres — lista todos los géneros
router.get('/genres', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, nombre FROM generos ORDER BY nombre');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los géneros' });
    }
});

// GET /api/publishers — lista todas las editoriales
router.get('/publishers', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, nombre FROM editoriales ORDER BY nombre');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las editoriales' });
    }
});

// GET /api/authors — lista todos los autores
router.get('/authors', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, nombre FROM autores ORDER BY nombre');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los autores' });
    }
});

// GET /api/books/by-genre/:id — libros que tienen ese género
router.get('/books/by-genre/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query(
            `SELECT libros.id, libros.titulo, libros.portada_url, libros.pagina
             FROM libros
             JOIN libros_generos ON libros.id = libros_generos.libro_id
             WHERE libros_generos.genero_id = $1
             ORDER BY libros.titulo`,
            [id]
        );
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

// GET /api/books/by-publisher/:id — libros de esa editorial
router.get('/books/by-publisher/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query(
            `SELECT id, titulo, portada_url, pagina
             FROM libros
             WHERE editorial_id = $1
             ORDER BY titulo`,
            [id]
        );
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

// GET /api/books/by-author/:id — libros de ese autor
router.get('/books/by-author/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query(
            `SELECT id, titulo, portada_url, pagina
             FROM libros
             WHERE autor_id = $1
             ORDER BY titulo`,
            [id]
        );
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

module.exports = router;