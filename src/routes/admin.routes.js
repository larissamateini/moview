const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

//BACKOFFICE ROUTES
// Importamos as instâncias das Classes
const conteudoCtrl = require('../controllers/conteudoController');
const personCtrl = require('../controllers/personController');
const reviewCtrl = require('../controllers/reviewController');
const userCtrl = require('../controllers/utilizadorController');
const generoCtrl = require('../controllers/generoController');
const listaCtrl = require('../controllers/listaController');

// Protege todas as rotas abaixo: Apenas ADMIN entra aqui
router.use(authMiddleware('admin'));

// --- ROTAS AUXILIARES TMDB (Adicione isto) ---
router.get('/conteudos/search/tmdb', conteudoCtrl.searchTmdb);
router.get('/conteudos/details/tmdb/:type/:id', conteudoCtrl.getTmdbDetails);

// --- CRUD Conteúdos (Filmes/Séries) ---
router.get('/conteudos', conteudoCtrl.index); 
router.get('/conteudos/:id', conteudoCtrl.show); 
router.post('/conteudos', conteudoCtrl.create);  
router.put('/conteudos/:id', conteudoCtrl.update);
router.delete('/conteudos/:id', conteudoCtrl.delete);

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

// --- CRUD Géneros ---
router.get('/generos', generoCtrl.index);
router.post('/generos', generoCtrl.create);
router.delete('/generos/:id', generoCtrl.delete);

// --- CRUD Listas (Administração) ---
router.get('/listas', listaCtrl.index);
router.delete('/listas/:id', listaCtrl.delete);

module.exports = router;