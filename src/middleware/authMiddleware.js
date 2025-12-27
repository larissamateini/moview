const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

function verifyAuth(requiredRole = null) {
    return (req, res, next) => {
        const token = req.headers['x-access-token'] || req.cookies.token;
        if (!token) return res.redirect('/login');

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                res.clearCookie('token');
                return res.redirect('/login');
            }
            req.userId = decoded.id;
            req.userRole = decoded.role;

            if (requiredRole && req.userRole !== 'admin' && req.userRole !== requiredRole) {
                return res.status(403).send("Acesso negado.");
            }
            next();
        });
    };
}

module.exports = verifyAuth;