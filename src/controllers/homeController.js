const { tmdbService, getGenreName } = require('../services/tmdbService');

class HomeController {
    async index(req, res) {
        try {
            const [rawFilmes, rawSeries] = await Promise.all([
                tmdbService.getPopularMovies(),
                tmdbService.getPopularShows()
            ]);

            // Função auxiliar para formatar cada item
            const formatarItem = (item, type) => ({
                ...item,
                type: type,
                vote_average: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
                genero: item.genre_ids && item.genre_ids.length > 0 ? getGenreName(item.genre_ids[0]) : "Geral",
                idioma: item.original_language ? item.original_language : "N/A"
            });

            // Formatar as duas listas separadamente
            const filmes = rawFilmes.map(f => formatarItem(f, 'movie'));
            const series = rawSeries.map(s => formatarItem(s, 'tv'));

            res.render('frontoffice/index', { 
                pageTitle: "Home", 
                pageStyle: "homepage",
                pageScript: "home",
                filmes, 
                series,
                user: req.user,
                menuHome: true 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar a Home");
        }
    }

    async details(req, res) {
        try {
            const { type, id } = req.params;
            const item = await tmdbService.getDetails(type, id);
            
            // Aqui também deves formatar o rating para a página de detalhes
            if (item && item.vote_average) {
                item.vote_average = item.vote_average.toFixed(1);
            }

            res.render('frontoffice/details', { 
                pageTitle: item.title || item.name, 
                pageStyle: "details",
                pageScript: "details",
                item // Não esqueças de enviar o 'item' para o mustache!
            });
        } catch (error) {
            res.status(404).send("Conteúdo não encontrado");
        }
    }

    profile(req, res) {
        res.render('frontoffice/profile', { 
            pageTitle: "Meu Perfil", 
            pageStyle: "profile",
            pageScript: "profile",
            user: req.user,
            menuProfile: true
        });
    }
}

module.exports = new HomeController();