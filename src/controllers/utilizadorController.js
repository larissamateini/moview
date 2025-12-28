const Utilizador = require('../models/Utilizador');

class UtilizadorController {
    async index(req, res) {
        try {
            const users = await Utilizador.getAll();
            
            const formattedData = users.map(user => ({
                ...user,
                isAdmin: user.role === 'admin',
                isUser: user.role === 'user' || user.role === 'comum'
            }));

            res.render('backoffice/utilizadores', { 
                data: formattedData, 
                pageTitle: "Gestão de Utilizadores",
                pageStyle: "backoffice",
                pageScript: "utilizadores"
            });
        } catch (error) {
            res.status(500).send("Erro ao carregar utilizadores");
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