const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
// Ajuste do caminho se o db estiver em src/database
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

// Configuração do Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
// Assume que a pasta views está dentro de src/ (src/views)
app.set('views', path.join(__dirname, 'views')); 
// Assume que a public está na raiz do projeto (fora do src)
app.use('/public', express.static(path.join(__dirname, '../public'))); 

// IMPORTAÇÃO DAS ROTAS (Caminhos corrigidos assumindo que estás em src/app.js)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/', authRoutes);      
app.use('/', userRoutes);      
app.use('/backoffice', adminRoutes); 

module.exports = app;