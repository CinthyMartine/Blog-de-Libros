const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const session = require('express-session');

app.use(session({
    secret: 'una_clave_secreta_cualquiera',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // la sesión dura 2 horas
}));

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

const catalogRoutes = require('./routes/catalog');
app.use('/api', catalogRoutes);

const bookRoutes = require('./routes/book');
app.use('/api/books', bookRoutes);

const commentsRoutes = require('./routes/comments');
app.use('/api/comments', commentsRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const recommendationsRoutes = require('./routes/recommendations');
app.use('/api/recommendations', recommendationsRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});