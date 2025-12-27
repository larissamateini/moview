const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

//BACKOFFICE ROUTES
// Importamos as instâncias das Classes
const conteudoCtrl = require('../controllers/conteudoController');
const personCtrl = require('../controllers/personController');
const reviewCtrl = require('../controllers/reviewController');
const userCtrl = require('../controllers/utilizadorController');

// Protege todas as rotas abaixo: Apenas ADMIN entra aqui
router.use(authMiddleware('admin'));

// --- CRUD Conteúdos (Filmes/Séries) ---
router.get('/conteudos', conteudoCtrl.index);          // Página de listagem
router.get('/conteudos/:id', conteudoCtrl.show);       // Dados de um filme (JSON para modal)
router.post('/conteudos', conteudoCtrl.create);        // Criar novo
router.put('/conteudos/:id', conteudoCtrl.update);     // Atualizar (Via Fetch)
router.delete('/conteudos/:id', conteudoCtrl.delete);  // Eliminar (Via Fetch)

// --- CRUD Staff (Atores/Diretores) ---
router.get('/diretores-atores', personCtrl.index);
router.post('/diretores-atores', personCtrl.create);
router.delete('/diretores-atores/:id', personCtrl.delete);

// --- CRUD Reviews (Moderação) ---
router.get('/reviews', reviewCtrl.index);
router.delete('/reviews/:id', reviewCtrl.delete);

// --- CRUD Utilizadores (Administração) ---
router.get('/utilizadores', userCtrl.index);
router.put('/utilizadores/:id', userCtrl.update);
router.delete('/utilizadores/:id', userCtrl.delete);

module.exports = router;