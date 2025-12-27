const utilizador = require('../models/utilizador'); // Importa o model
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const authController = {
    // GET: Mostrar formulário de login
    loginForm: (req, res) => {
        res.render('frontoffice/login', { 
            pageTitle: "Login", 
            pageStyle: "form"
        });
    },

    // POST: Processar o login
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            // Chamamos o Model para verificar as credenciais
            const user = await utilizador.getByCredentials(email, password);

            if (user) {
                const token = jwt.sign(
                    { id: user.id, role: user.role },
                    SECRET,
                    { expiresIn: 3600 }
                );
                res.cookie('token', token, { httpOnly: true });
                return res.redirect('/');
            }

            res.render('frontoffice/login', { error: "Login inválido" });
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro no servidor");
        }
    },

    // GET: Mostrar formulário de registo
    signupForm: (req, res) => {
        res.render('frontoffice/signup', { 
            pageTitle: "Registo",
            pageStyle: "form" 
        });
    },

    // POST: Criar novo utilizador (Signup)
    signup: async (req, res) => {
        try {
            await utilizador.register(req.body);
            res.redirect('/login');
        } catch (err) {
            console.error(err);
            // Verifica se o erro é de entrada duplicada (Código 1062 do MySQL)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.render('frontoffice/signup', { 
                    error: "O username ou email já estão em uso. Escolha outro.",
                    pageTitle: "Registo",
                    pageStyle: "form"
                });
            }
            
            res.status(500).send("Erro ao registar utilizador.");
        }
    },

    // GET: Logout
    logout: (req, res) => {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

module.exports = authController;