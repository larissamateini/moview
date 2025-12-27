const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const db = require('./database/connection');

db.getConnection()
    .then(conn => {
        console.log("Conectado ao MySQL com sucesso!");
        conn.release();
    })
    .catch(err => {
        console.error("Erro ao ligar à Base de Dados:", err.message);
    });

// Configurações e Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// config mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, '../public')));

// IMPORTAÇÃO DAS ROTAS
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/backoffice', adminRoutes);

module.exports = app;