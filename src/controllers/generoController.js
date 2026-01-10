const Genero = require('../models/Genero');

class GeneroController {
    async index(req, res) {
        try {
            const generos = await Genero.getAll();
            res.render('backoffice/generos', {
                data: generos,
                pageTitle: "Gestão de Géneros",
                pageStyle: "backoffice"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar géneros");
        }
    }

    async create(req, res) {
        try {
            const { nome } = req.body;
            await Genero.create(nome);
            res.redirect('/backoffice/generos');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao criar género");
        }
    }

    async delete(req, res) {
        try {
            await Genero.delete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            // Se houver filmes associados a este género, o SQL pode dar erro de FK
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new GeneroController();
