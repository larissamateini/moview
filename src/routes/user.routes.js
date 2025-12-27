const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// mainController para a home do utilizador comum
const mainController = {
    index: (req, res) => res.render('frontoffice/index', { pageTitle: "Home", pageStyle: "homepage" }),
    details: (req, res) => res.render('frontoffice/details', { pageTitle: "Detalhes", pageStyle: "details" }),
    profile: (req, res) => res.render('frontoffice/profile', { pageTitle: "Meu Perfil", pageStyle: "profile" })
};

router.get('/', authMiddleware(), mainController.index);
router.get('/details', authMiddleware(), mainController.details);
router.get('/profile', authMiddleware(), mainController.profile);

module.exports = router;