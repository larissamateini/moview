const Review = require('../models/Review');
const Conteudo = require('../models/Conteudo');

class ReviewController {
    // --- BACKOFFICE ---
    async index(req, res) {
        try {
            // 1. Capturar o que o utilizador digitou no search
            const query = req.query.q || ''; 
            
            // 2. Passar esse valor para o Model
            const reviews = await Review.getAll(query);

            res.render('backoffice/reviews', {
                data: reviews,
                query: query, // Para manter o texto na barra de busca após o refresh
                pageTitle: "Gestor de Reviews",
                pageStyle: "backoffice"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar reviews");
        }
    }

    async delete(req, res) {
        try {
            await Review.delete(req.params.id);
            res.json({ success: true, message: "Review eliminada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: "Erro ao eliminar review" });
        }
    }

    // --- FRONTOFFICE ---

    async getReviewForm(req, res) {
        try {
            const { type, id } = req.params;
            // Fetch detalhes do TMDB para popular o form (titulo, imagem, etc)
            // Necessário para o findOrCreate no post
            const { tmdbService } = require('../services/tmdbService'); // Lazy load if not top level
            const item = await tmdbService.getDetails(type, id);

            if (!item) {
                return res.status(404).render('error', { message: 'Conteúdo não encontrado' });
            }

            // Normalizar titulo
            const title = item.title || item.name;
            const releaseDate = item.release_date || item.first_air_date;

            res.render('frontoffice/review_form', {
                tmdb_id: id,
                media_type: type,
                user: req.user,
                pageTitle: "Criar Review",
                pageScript: "front_interactions",
                pageStyle: "criar-review",
                item: {
                    title: title,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    backdrop_path: item.backdrop_path,
                    release_year: releaseDate ? releaseDate.split('-')[0] : 'N/A'
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { message: 'Erro ao carregar formulário de review' });
        }
    }

    async postReview(req, res) {
        try {
            const userId = req.user.id;
            const contentData = req.body; 

            const conteudo = await Conteudo.findOrCreate(contentData);

            await Review.create({
                utilizador_id: userId,
                conteudo_id: conteudo.id,
                classificacao: req.body.classificacao,
                critica: req.body.critica
            });

            res.redirect(`/details/${contentData.media_type}/${contentData.tmdb_id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao publicar review");
        }
    }

    async voteUtility(req, res) {
        try {
            const reviewId = req.params.id;
            
            // 1. Chamar o Model para incrementar o voto na DB
            const newCount = await Review.incrementUtility(reviewId);

            res.json({ 
                success: true, 
                newCount: newCount 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
}

module.exports = new ReviewController();