const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const reviewController = require('../controllers/reviewController');
const homeController = require('../controllers/homeController');
const utilizadorController = require('../controllers/utilizadorController');
const favoritoController = require('../controllers/favoritoController');
// IMPORTANTE: Adiciona o controller de listas se o criaste separadamente
// Se as funções ainda estão no utilizadorController, mantém como estavas
const listaController = require('../controllers/listaController'); 

router.use(authMiddleware('user'));

// --- NAVEGAÇÃO ---
router.get('/', homeController.index);
router.get('/details/:type/:id', homeController.details);
router.get('/profile', homeController.profile);
router.get('/search', homeController.search);

// --- FAVORITOS (Usando FavoritoController) ---
router.get('/favoritos', favoritoController.getFavoritos);
router.post('/favoritos/add', favoritoController.add);
router.delete('/favoritos/delete/:id', favoritoController.delete);

// --- LISTAS (Usando ListaController) ---
// Ajustei os nomes das funções para o padrão comum (index, show, create, etc)
// VERIFICA se no teu listaController os nomes são estes:
router.get('/listas', listaController.index);
router.get('/lista/:id', listaController.show);

// Criar Lista
router.get('/listas/criar', listaController.renderCreate);
router.post('/listas/criar', listaController.create);

// Editar / Eliminar Lista
router.get('/listas/editar/:id', listaController.renderEdit);
router.post('/listas/editar/:id', listaController.update);
router.post('/listas/delete/:id', listaController.delete); // Ou router.delete

// Manipular Itens dentro da Lista
router.post('/listas/add-item', listaController.addItem);
router.post('/listas/remove-item', listaController.removeItem);

// --- REVIEWS ---
router.get('/review/:type/:id', reviewController.getReviewForm);
router.post('/review', reviewController.postReview);
router.post('/review/vote/:id', reviewController.voteUtility);

module.exports = router;