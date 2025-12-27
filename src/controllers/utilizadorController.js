const Utilizador = require('../models/utilizador');

const utilizadorController = {
    // GET: Listar todos
    index: async (req, res) => {
        try {
            const users = await Utilizador.getAll();
            res.render('backoffice/utilizadores', {
                data: users,
                pageTitle: "Gerir Utilizadores"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao listar utilizadores");
        }
    },

    // GET: Mostrar um (JSON para API ou Modal)
    show: async (req, res) => {
        try {
            const user = await Utilizador.getById(req.params.id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "Utilizador não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar utilizador" });
        }
    },

    // Criar
    create: async (req, res) => {
        try {
            await Utilizador.create(req.body);
            res.redirect('/backoffice/utilizadores');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao criar utilizador");
        }
    },

    // Atualizar 
    update: async (req, res) => {
        try {
            const { id } = req.params;
            await Utilizador.update(id, req.body);
            res.redirect('/backoffice/utilizadores');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao atualizar utilizador");
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await Utilizador.delete(req.params.id);
            res.redirect('/backoffice/utilizadores');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao eliminar utilizador");
        }
    }
};

module.exports = utilizadorController;