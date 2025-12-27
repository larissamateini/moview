const Conteudo = require('../models/conteudo');

class ConteudoController {
    async index(req, res) {
        try {
            const rows = await Conteudo.getAll();
            res.render('backoffice/conteudos', {
                data: rows,
                pageTitle: "Gerir Filmes"
            });
        } catch (error) {
            res.status(500).send("Erro ao listar conteúdos");
        }
    }

    async show(req, res) {
        try {
            const row = await Conteudo.getById(req.params.id);
            if (row) res.json(row);
            else res.status(404).json({ message: "Não encontrado" });
        } catch (error) {
            res.status(500).json({ error: "Erro na BD" });
        }
    }

    async create(req, res) {
        try {
            const id = await Conteudo.create(req.body);
            res.status(201).json({ message: "Criado com sucesso", id });
        } catch (err) {
            res.status(500).json({ error: "Erro ao criar" });
        }
    }

    async update(req, res) {
        try {
            await Conteudo.update(req.params.id, req.body);
            res.json({ message: "Atualizado com sucesso" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar" });
        }
    }

    async delete(req, res) {
        try {
            await Conteudo.delete(req.params.id);
            res.json({ message: "Eliminado com sucesso" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao eliminar" });
        }
    }
}

module.exports = new ConteudoController();