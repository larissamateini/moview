const { tmdbService, getGenreName } = require('../services/tmdbService');
const Utilizador = require('../models/Utilizador');
const Review = require('../models/Review');

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

            if (!item) return res.status(404).send("Conteúdo não encontrado.");
            
            // Diretor e Elenco (Top 3)
            const director = item.credits?.crew.find(person => person.job === 'Director');
            const cast = item.credits?.cast.slice(0, 3).map(actor => actor.name).join(', ');

            // Trailer (YouTube)
            const trailer = item.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

            // Classificação Etária
            let classification = "N/A";
            if (type === 'movie' && item.release_dates?.results) {
                const cert = item.release_dates.results
                    .find(r => r.iso_3166_1 === 'PT' || r.iso_3166_1 === 'US');
                classification = cert?.release_dates[0]?.certification;

            } else if (type === 'tv' && item.content_ratings?.results) {
                const cert = item.content_ratings.results
                    .find(r => r.iso_3166_1 === 'PT' || r.iso_3166_1 === 'US');
                classification = cert?.rating;
            }

            // formata o rating 
            const rating = Number(item.vote_average);
            const formattedRating = !isNaN(rating) ? rating.toFixed(1) : "0.0";

            // formata apenas o ano
            const releaseDate = item.release_date || item.first_air_date;
            const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

            const reviews = await Review.getByContentId(id);

            res.render('frontoffice/details', {
                pageTitle: item.title? item.title : item.name, 
                pageStyle: "details",
                pageScript: "details",
                item: {
                    ...item,
                    release_year: releaseYear,
                    vote_average: formattedRating,
                    director: director ? director.name : "Desconhecido",
                    main_cast: cast,
                    classification: classification || "+12"
                },
                trailerKey: trailer ? trailer.key : null,
                reviews: reviews,
                user: req.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar detalhes.");
        }
    }

    async profile(req, res) {
        try {
            // req.user vem do teu token/sessão com {id, role}
            const userData = await Utilizador.getById(req.user.id);

            if (!userData) {
                return res.redirect('/login');
            }

            res.render('frontoffice/profile', { 
                pageTitle: "Meu Perfil", 
                pageStyle: "profile",
                pageScript: "profile",
                // Combinamos os dados do token com os dados da DB
                user: {
                    ...req.user,
                    ...userData
                },
                menuProfile: true
            });
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            res.status(500).send("Erro ao carregar os dados do utilizador.");
        }
    }
}

module.exports = new HomeController();