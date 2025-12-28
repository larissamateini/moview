const { tmdbService, getGenreName, GENRE_MAP } = require('../services/tmdbService');
const Utilizador = require('../models/Utilizador');
const Review = require('../models/Review');

class HomeController {
    async index(req, res) {
        try {
            const [rawFilmes, rawSeries] = await Promise.all([
                tmdbService.getPopularMovies(),
                tmdbService.getPopularShows()
            ]);

            const formatItem = (item, type) => {
                const date = item.release_date || item.first_air_date;
                return {
                    ...item,
                    type: type,
                    release_year: date ? date.split('-')[0] : 'N/A',
                    vote_average: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
                    genero: item.genre_ids && item.genre_ids.length > 0 ? getGenreName(item.genre_ids[0]) : "Geral",
                    idioma: item.original_language ? item.original_language.toUpperCase() : "N/A"
                };
            };

            const filmes = rawFilmes.slice(0, 10).map(f => formatItem(f, 'movie'));
            const series = rawSeries.slice(0, 10).map(s => formatItem(s, 'tv'));
            const generos = Object.values(GENRE_MAP).sort();

            res.render('frontoffice/index', { 
                pageTitle: "Home", pageStyle: "homepage", pageScript: "home",
                filmes, series, generos, user: req.user, menuHome: true 
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
            
            const director = item.credits?.crew.find(person => person.job === 'Director');
            const cast = item.credits?.cast.slice(0, 3).map(actor => actor.name).join(', ');
            const trailer = item.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const genresFormatted = item.genres.map(g => g.name).join(', ');

            let classification = "N/A";
            if (type === 'movie' && item.release_dates?.results) {
                const cert = item.release_dates.results.find(r => r.iso_3166_1 === 'PT' || r.iso_3166_1 === 'US');
                classification = cert?.release_dates[0]?.certification || "N/A";
            } else if (type === 'tv' && item.content_ratings?.results) {
                const cert = item.content_ratings.results.find(r => r.iso_3166_1 === 'PT' || r.iso_3166_1 === 'US');
                classification = cert?.rating || "N/A";
            }

            const releaseDate = item.release_date || item.first_air_date;
            const reviews = await Review.getByContentId(id);

            res.render('frontoffice/details', {
                pageTitle: item.title || item.name, 
                pageStyle: "details",
                pageScript: "details",
                item: {
                    ...item,
                    genres_string: genresFormatted,
                    release_year: releaseDate ? releaseDate.split('-')[0] : 'N/A',
                    vote_average: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
                    director: director ? director.name : "Desconhecido",
                    main_cast: cast,
                    classification: classification
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
            const userData = await Utilizador.getById(req.user.id);
            if (!userData) return res.redirect('/login');
            res.render('frontoffice/profile', { 
                pageTitle: "Meu Perfil", pageStyle: "profile", pageScript: "profile",
                user: { ...req.user, ...userData }, menuProfile: true
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar perfil.");
        }
    }
}

module.exports = new HomeController();