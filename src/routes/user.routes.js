const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const homeController = require('../controllers/homeController');
// FRONTOFFICE ROUTES
// Middleware: Garante que está logado. 
// Passamos 'user' para garantir que ADMINS não acessam (se a lógica do teu middleware for exclusiva)
router.use(authMiddleware('user')); 

// Rota raiz (Home)
router.get('/', homeController.index);

// Rota de Detalhes Dinâmica
// Ex: /details/movie/550 ou /details/tv/123
router.get('/details/:type/:id', homeController.details);

// Perfil
router.get('/profile', homeController.profile);

module.exports = router;