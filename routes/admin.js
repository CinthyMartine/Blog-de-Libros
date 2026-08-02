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

module.exports = router;