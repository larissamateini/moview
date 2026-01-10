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
                    // Renderiza página de erro dedicada
                    return res.status(403).render('error', {
                        message: "Acesso não autorizado. Esta área é restrita."
                    });
                }
                // Se a rota for só para user (ex: favoritos) e um admin tentar?
                // O middleware 'user' permite admin? authMiddleware('user') geralmente significa 'qualquer logado' ou 'role user'?
                // O código original fazia: if(requiredRole === 'admin' && req.userRole !== 'admin').
                // Para rotas de user, talvez admin possa ver?
                // Se for restrito:
                if (requiredRole === 'user' && req.userRole !== 'user' && req.userRole !== 'admin') {
                    // Ajuste conform regra de negocio. Geralmente Admin pode tudo ou nao deve usar Front.
                    // Assumindo que User routes sao para todos logados (incluindo admin testando) ou só User.
                    // Deixamos passar se nao for explicito.
                }
            }

            next();
        });
    };
}

module.exports = verifyAuth;