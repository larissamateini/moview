const Utilizador = require('../models/Utilizador');

class UtilizadorController {
    async index(req, res) {
        try {
            // 1. CAPTURAR os filtros que vêm da URL (req.query)
            const { id_filter, role } = req.query;

            // 2. PASSAR os filtros para o Model
            const users = await Utilizador.getAll({ id_filter, role });

            const loggedInId = req.session?.user?.id || req.user?.id;
            const formattedData = users.map(user => ({
                ...user,
                isAdmin: user.role === 'admin',
                isUsers: true,
                // Só será true se houver um utilizador logado E o ID coincidir
                isMe: loggedInId ? (user.id === loggedInId) : false
            }));

            // 3. ENVIAR de volta para o Mustache os valores atuais 
            // para que os campos não fiquem vazios após o refresh
            res.render('backoffice/utilizadores', {
                data: formattedData,
                id_filter: id_filter,
                role: role,
                isUserSelected: role === 'user',
                isAdminSelected: role === 'admin',
                pageTitle: "Gestão de Utilizadores",
                pageStyle: "backoffice",
                isUsers: true
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar utilizadores");
        }
    }

    async update(req, res) {
        try {
            await Utilizador.update(req.params.id, req.body);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar" });
        }
    }

    async delete(req, res) {
        try {
            const idParaEliminar = req.params.id;
            const meuId = req.user.id;

            // Impede que um utilizador admin apague a sua própria conta
            if (parseInt(idParaEliminar) === parseInt(meuId)) {
                return res.status(403).json({ 
                    error: "Segurança: Não pode apagar a sua própria conta através do painel de administração." 
                });
            }

            await Utilizador.delete(idParaEliminar);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: "Erro ao eliminar" });
        }
    }
}
module.exports = new UtilizadorController();