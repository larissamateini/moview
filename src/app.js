const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const app = express();

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do motor Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Servir ficheiros estáticos
app.use('/public', express.static(path.join(__dirname, '../public')));


// exemplos rotas

// Rota para home
app.get('/', (req, res) => {
    res.render('frontoffice/index', {
        pageTitle: "Moview | Home",
        pageStyle: "homepage"
    });
});

app.get('/details', (req, res) => {
    res.render('frontoffice/details', {
        pageTitle: "Moview | Detalhes do Filme",
        pageStyle: "details"
    });
});

app.get('/profile', (req, res) => {
    res.render('frontoffice/profile', {
        pageTitle: "Moview | Perfil",
        pageStyle: "profile"
    });
});


// Rota para o Signup
app.get('/signup', (req, res) => {
    res.render('frontoffice/signup', {
        pageTitle: "Moview | Sign Up",
        pageStyle: "form"
    });
});

// rotas backoffice

app.get('/backoffice/', (req, res) => {
    res.render('backoffice/index', {
        pageTitle: "Backoffice | Conteúdos",
        pageStyle: "backoffice"
    });
});

app.get('/backoffice/utilizadores', (req, res) => {
    res.render('backoffice/utilizadores', {
        pageTitle: "Backoffice | Utilizadores",
        pageStyle: "backoffice"
    });
});

app.get('/backoffice/reviews', (req, res) => {
    res.render('backoffice/reviews', {
        pageTitle: "Backoffice | Reviews",
        pageStyle: "backoffice"
    });
});

app.get('/backoffice/diretores-atores', (req, res) => {
    res.render('backoffice/diretores-atores', {
        pageTitle: "Backoffice | Diretores & Atores",
        pageStyle: "backoffice"
    });
});

module.exports = app;