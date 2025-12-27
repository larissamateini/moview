const Utilizador = require('../models/utilizador');

class UtilizadorController {
    async index(req, res) {
        try {
            const users = await Utilizador.getAll();
            res.render('backoffice/utilizadores', {
                data: users,
                pageTitle: "Gerir Utilizadores"
            });
        } catch (error) {
            res.status(500).send("Erro ao listar");
        }
    }

    async update(req, res) {
        try {
            await Utilizador.update(req.params.id, req.body);
            res.json({ message: "Utilizador atualizado" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar" });
        }
    }

    async delete(req, res) {
        try {
            await Utilizador.delete(req.params.id);
            res.json({ message: "Utilizador removido" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao eliminar" });
        }
    }
}

module.exports = new UtilizadorController();