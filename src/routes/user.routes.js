const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const homeController = require('../controllers/homeController');
// FRONTOFFICE ROUTES
// Middleware: Garante que está logado. 
// Passamos 'user' para garantir que ADMINS não acessam
router.use(authMiddleware('user')); 

// Rota raiz (Home)
router.get('/', homeController.index);

// Rota de Detalhes (acompanha a api externa que categoriza em movie e tv)
router.get('/details/:type/:id', homeController.details);

// Perfil
router.get('/profile', homeController.profile);

router.get('/search', homeController.search);

module.exports = router;