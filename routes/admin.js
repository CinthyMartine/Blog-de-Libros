const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireAdmin = require('../middleware/requireAdmin');

// GET /api/admin/recommendations — lista las recomendaciones pendientes
router.get('/recommendations', requireAdmin, async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT 
                recomendaciones.id,
                recomendaciones.titulo_libro,
                recomendaciones.autor_libro,
                recomendaciones.motivo,
                recomendaciones.fecha,
                usuarios.nombre AS recomendado_por
             FROM recomendaciones
             JOIN usuarios ON recomendaciones.usuario_id = usuarios.id
             WHERE recomendaciones.estado = 'pendiente'
             ORDER BY recomendaciones.fecha ASC`
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las recomendaciones' });
    }
});

// POST /api/admin/recommendations/:id/approve — aprueba una recomendación y crea el libro real
router.post('/recommendations/:id/approve', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { titulo, autor_id, editorial_id, portada_url, pagina, generos } = req.body;

    if (!titulo || !autor_id || !editorial_id || !pagina) {
        return res.status(400).json({ error: 'Faltan datos del libro' });
    }

    try {
        // 1. Buscar quién recomendó este libro
        const recomendacion = await pool.query(
            'SELECT usuario_id FROM recomendaciones WHERE id = $1',
            [id]
        );

        if (recomendacion.rows.length === 0) {
            return res.status(404).json({ error: 'Recomendación no encontrada' });
        }

        const usuarioId = recomendacion.rows[0].usuario_id;

        // 2. Crear el libro real, con recomendado_por
        const libroNuevo = await pool.query(
            `INSERT INTO libros (titulo, portada_url, autor_id, editorial_id, pagina, recomendado_por)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [titulo, portada_url, autor_id, editorial_id, pagina, usuarioId]
        );

        const libroId = libroNuevo.rows[0].id;

        // 3. Conectar los géneros seleccionados
        if (generos && generos.length > 0) {
            for (const generoId of generos) {
                await pool.query(
                    'INSERT INTO libros_generos (libro_id, genero_id) VALUES ($1, $2)',
                    [libroId, generoId]
                );
            }
        }

        // 4. Marcar la recomendación como aprobada
        await pool.query(
            "UPDATE recomendaciones SET estado = 'aprobado' WHERE id = $1",
            [id]
        );

        res.status(201).json({ mensaje: 'Libro creado y recomendación aprobada', libro_id: libroId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al aprobar la recomendación' });
    }
});

// GET /api/admin/options — trae autores, editoriales y géneros para los formularios
router.get('/options', requireAdmin, async (req, res) => {
    try {
        const autores = await pool.query('SELECT id, nombre FROM autores ORDER BY nombre');
        const editoriales = await pool.query('SELECT id, nombre FROM editoriales ORDER BY nombre');
        const generos = await pool.query('SELECT id, nombre FROM generos ORDER BY nombre');

        res.json({
            autores: autores.rows,
            editoriales: editoriales.rows,
            generos: generos.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las opciones' });
    }
});

// POST /api/admin/books — crear un libro nuevo directamente (sin recomendación)
router.post('/books', requireAdmin, async (req, res) => {
    const { titulo, autor_id, editorial_id, portada_url, pagina, generos, destacado } = req.body;

    if (!titulo || !autor_id || !editorial_id || !pagina) {
        return res.status(400).json({ error: 'Faltan datos del libro' });
    }

    try {
        const libroNuevo = await pool.query(
            `INSERT INTO libros (titulo, portada_url, autor_id, editorial_id, pagina, destacado)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [titulo, portada_url, autor_id, editorial_id, pagina, destacado || false]
        );

        const libroId = libroNuevo.rows[0].id;

        if (generos && generos.length > 0) {
            for (const generoId of generos) {
                await pool.query(
                    'INSERT INTO libros_generos (libro_id, genero_id) VALUES ($1, $2)',
                    [libroId, generoId]
                );
            }
        }

        res.status(201).json({ mensaje: 'Libro creado correctamente', libro_id: libroId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el libro' });
    }
});

// POST /api/admin/authors — crear un autor nuevo
router.post('/authors', requireAdmin, async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'Falta el nombre del autor' });
    }

    try {
        const resultado = await pool.query(
            'INSERT INTO autores (nombre) VALUES ($1) RETURNING id, nombre',
            [nombre]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el autor' });
    }
});

// POST /api/admin/publishers — crear una editorial nueva
router.post('/publishers', requireAdmin, async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'Falta el nombre de la editorial' });
    }

    try {
        const resultado = await pool.query(
            'INSERT INTO editoriales (nombre) VALUES ($1) RETURNING id, nombre',
            [nombre]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la editorial' });
    }
});

// GET /api/admin/comments — lista todos los comentarios, más recientes primero
router.get('/comments', requireAdmin, async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT 
                comentarios.id,
                comentarios.texto,
                comentarios.fecha,
                usuarios.nombre AS usuario,
                libros.titulo AS libro
             FROM comentarios
             JOIN usuarios ON comentarios.usuario_id = usuarios.id
             JOIN libros ON comentarios.libro_id = libros.id
             ORDER BY comentarios.fecha DESC`
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
});

// DELETE /api/admin/comments/:id — elimina un comentario
router.delete('/comments/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM comentarios WHERE id = $1', [id]);
        res.json({ mensaje: 'Comentario eliminado' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el comentario' });
    }
});

module.exports = router;