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

            // 2. Lógica de Separação Estrita (Redirecionamento Inteligente)
            if (requiredRole) {
                // Se a rota exige 'admin' mas sou 'user' -> Manda para Home ou 403
                if (requiredRole === 'admin' && req.userRole !== 'admin') {
                    return res.status(403).render('frontoffice/index', { // Ou redirect '/'
                        error: "Acesso não autorizado.",
                        user: req.user
                    }); 
                }

                // Se a rota exige 'user' (Frontoffice) mas sou 'admin' -> Manda para Backoffice
                // O teu requisito: "usuário admin somente ao backoffice"
                if (requiredRole === 'user' && req.userRole === 'admin') {
                    return res.redirect('/backoffice/conteudos');
                }
            }

            next();
        });
    };
}

module.exports = verifyAuth;