function requireAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'Debes iniciar sesión' });
    }

    if (!req.session.usuario.es_admin) {
        return res.status(403).json({ error: 'No tienes permisos de administrador' });
    }

    next(); 
}

module.exports = requireAdmin;