const person = require('../models/person');

const personController = {
    index: async (req, res) => {
        try {
            const rows = await person.getAll();
            res.render('backoffice/diretores-atores', {
                data: rows,
                pageTitle: "Gestão de Atores e Diretores"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao listar atores/diretores");
        }
    },
    create: async (req, res) => {
        try {
            await person.create(req.body);
            res.redirect('/backoffice/diretores-atores');
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao criar registo");
        }
    },
    delete: async (req, res) => {
        try {
            await person.delete(req.params.id);
            res.redirect('/backoffice/diretores-atores');
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao eliminar registo");
        }
    }
};

module.exports = personController;
