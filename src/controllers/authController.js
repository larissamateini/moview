const Utilizador = require('../models/Utilizador');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

class AuthController {
    loginForm(req, res) {
        res.render('frontoffice/login', {
            pageTitle: "Login",
            pageStyle: "form"
        });
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await Utilizador.getByCredentials(email, password);

            if (user) {
                const token = jwt.sign(
                    { id: user.id, role: user.role },
                    SECRET,
                    { expiresIn: '1h' }
                );

                res.cookie('token', token, { httpOnly: true });

                // Redirecionamento baseado no prefixo definido no app.js (/backoffice)
                if (user.role === 'admin') {
                    return res.redirect('/backoffice/conteudos');
                } else {
                    return res.redirect('/');
                }
            }

            res.render('frontoffice/login', {
                error: "Login inválido",
                pageTitle: "Login",
                pageStyle: "form"
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro no servidor");
        }
    }

    signupForm(req, res) {
        res.render('frontoffice/signup', {
            pageTitle: "Registo",
            pageStyle: "form"
        });
    }

    async signup(req, res) {
        const { password, confirmPassword, role, fullName, email, username } = req.body;

        if (password !== confirmPassword) {
            return res.render('frontoffice/signup', {
                error: "As senhas não coincidem.",
                pageTitle: "Registo",
                pageStyle: "form"
            });
        }

        try {
            await Utilizador.register({ fullName, email, username, password, role }); 
            res.redirect('/login');
        } catch (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.render('frontoffice/signup', {
                    error: "O username ou email já estão em uso.",
                    pageTitle: "Registo",
                    pageStyle: "form"
                });
            }
            res.status(500).send("Erro ao registar.");
        }
    }

    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/login');
    }
}

module.exports = new AuthController();