const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

// POST /api/auth/register — crear una cuenta nueva
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos para el registro' });
    }

    try {
        // 1. Verificar que el correo no esté ya registrado
        const existente = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (existente.rows.length > 0) {
            return res.status(409).json({ error: 'Ese correo ya está registrado' });
        }

        // 2. Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Guardar el usuario nuevo
        const resultado = await pool.query(
            `INSERT INTO usuarios (nombre, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, nombre, email`,
            [nombre, email, passwordHash]
        );

        // 4. Iniciar sesión automáticamente después de registrarse
        req.session.usuario = resultado.rows[0];

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// POST /api/auth/login — iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan datos para iniciar sesión' });
    }

    try {
        const resultado = await pool.query(
            'SELECT id, nombre, email, password_hash FROM usuarios WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const usuario = resultado.rows[0];

        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Iniciar sesión
        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        };

        res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;

