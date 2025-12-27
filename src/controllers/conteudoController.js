const conteudo = require('../models/conteudo');

const conteudoController = {
    // GET: Listar todos os conteúdos
    index: async (req, res) => {
        try {
            const rows = await conteudo.getAll();
            res.render('backoffice/conteudos', {
                data: rows,
                pageTitle: "Gerir Filmes"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao listar conteúdos");
        }
    },

    // GET: Mostrar um (JSON)
    show: async (req, res) => {
        try {
            const row = await conteudo.getById(req.params.id);
            if (row) res.json(row);
            else res.status(404).json({ message: "Conteúdo não encontrado" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar conteúdo" });
        }
    },

    // POST: Criar conteúdo
    create: async (req, res) => {
        try {
            await conteudo.create(req.body);
            res.redirect('/backoffice/conteudos');
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao criar conteúdo");
        }
    },

    // POST: Atualizar conteúdo
    update: async (req, res) => {
        try {
            const { id } = req.params;
            await conteudo.update(id, req.body);
            res.redirect('/backoffice/conteudos');
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar conteúdo");
        }
    },

    // GET/POST: Remover conteúdo
    delete: async (req, res) => {
        try {
            await conteudo.delete(req.params.id);
            res.redirect('/backoffice/conteudos');
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao eliminar conteúdo");
        }
    }
};

module.exports = conteudoController;