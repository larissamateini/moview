const Favorito = require('../models/Favorito');
const Conteudo = require('../models/Conteudo');

class FavoritoController {
    async getFavoritos(req, res) {
        try {
            const favoritos = await Favorito.getByUser(req.user.id);
            res.render('frontoffice/favoritos', {
                favoritos,
                pageTitle: "Meus Favoritos",
                pageStyle: "favorites", // Estilo do front
                pageScript: "front_interactions", // Script que lida com cliques no coração
                user: req.user
            });
        } catch (error) {
            res.status(500).render('error', { message: "Erro ao carregar favoritos" });
        }
    }

    async add(req, res) {
        try {
            const conteudo = await Conteudo.findOrCreate(req.body);
            await Favorito.add(req.user.id, conteudo.id);
            res.json({ success: true });
        } catch (error) {
            console.error("ERRO NO BACKEND:", error); // Verifica o terminal do VS Code!
            res.status(500).json({ success: false, message: error.message });
        }
    }

    
   async delete(req, res) {
        try {
            const { id } = req.params;
            await Favorito.delete(req.user.id, id);
            
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
}
module.exports = new FavoritoController();