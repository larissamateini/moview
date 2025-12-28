const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

function verifyAuth(requiredRole = null) {
    return (req, res, next) => {
        const token = req.cookies.token || req.headers['x-access-token'];

        if (!token) {
            return res.redirect('/login');
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            // 1. Guardar o utilizador descodificado no req.user para usar nos Controllers
            req.user = decoded; 
            req.userId = decoded.id; // Mantemos por compatibilidade
            req.userRole = decoded.role;

            // 2. Lógica de Separação
            if (requiredRole) {
                if (requiredRole === 'admin' && req.userRole !== 'admin') {
                    return res.status(403).render('frontoffice/index', {
                        error: "Acesso não autorizado. Esta área é reservada a administradores.",
                        user: req.user
                    }); 
                }
            }

            next();
        });
    };
}

module.exports = verifyAuth;