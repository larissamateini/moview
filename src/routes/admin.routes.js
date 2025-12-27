const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const conteudoCtrl = require('../controllers/conteudoController');
const personCtrl = require('../controllers/personController');
const reviewCtrl = require('../controllers/reviewController');
const userCtrl = require('../controllers/utilizadorController');

router.use(authMiddleware('admin'));

// CRUD Conteúdos
router.get('/conteudos', conteudoCtrl.index);
router.get('/conteudos/:id', conteudoCtrl.show);
router.post('/conteudos', conteudoCtrl.create);
router.post('/conteudos/update/:id', conteudoCtrl.update);
router.get('/conteudos/delete/:id', conteudoCtrl.delete); // GET para facilitar o link no Mustache

// CRUD Staff (Atores/Diretores)
router.get('/diretores-atores', personCtrl.index);
router.post('/diretores-atores', personCtrl.create);
router.get('/diretores-atores/delete/:id', personCtrl.delete);

// CRUD Reviews
router.get('/reviews', reviewCtrl.index);
router.get('/reviews/delete/:id', reviewCtrl.delete);

// CRUD Utilizadores (Administração)
router.get('/utilizadores', userCtrl.index);
router.post('/utilizadores/update/:id', userCtrl.update);
router.get('/utilizadores/delete/:id', userCtrl.delete);

module.exports = router;