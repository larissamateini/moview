const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas de Login
router.get('/login', authController.loginForm);
router.post('/login', authController.login);

// Rotas de Registo
router.get('/signup', authController.signupForm);
router.post('/signup', authController.signup);

// Rota de Logout
router.get('/logout', authController.logout);

module.exports = router;