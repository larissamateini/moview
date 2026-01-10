const { tmdbService, getGenreName, GENRE_MAP } = require('../services/tmdbService');
const Utilizador = require('../models/Utilizador');
const Review = require('../models/Review');
const Conteudo = require('../models/Conteudo');
const Favorito = require('../models/Favorito');

class HomeController {
    async index(req, res) {
        try {
            const [rawFilmes, rawSeries] = await Promise.all([
                tmdbService.getPopularMovies(),
                tmdbService.getPopularShows()
            ]);

            const generos = Object.values(GENRE_MAP).sort().map(gName => ({
                name: gName,
                isSelected: false
            }));

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

            res.render('frontoffice/index', {
                pageTitle: "Home", 
                pageStyle: "homepage", 
                pageScript: "front_interactions", // Alterado para o novo script central
                filmes, 
                series, 
                generos, 
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

            const localConteudo = await Conteudo.getByTmdbId(id, type === 'tv' ? 'tv' : 'movie');
            let reviews = [];

            if (localConteudo) {
                reviews = await Review.getByContentId(localConteudo.id);
            }

            let isFavorite = false;
            if (req.user) {
                // IMPORTANTE: O teu método Favorito.isFavorite deve aceitar o tmdb_id
                isFavorite = await Favorito.isFavorite(req.user.id, id); 
            }

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

            res.render('frontoffice/details', {
                pageTitle: item.title || item.name,
                pageStyle: "details",
                pageScript: "front_interactions", // Alterado para o novo script central
                item: {
                    ...item,
                    media_type: type,
                    genres_string: genresFormatted,
                    release_year: releaseDate ? releaseDate.split('-')[0] : 'N/A',
                    vote_average: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
                    director: director ? director.name : "Desconhecido",
                    main_cast: cast,
                    classification: classification,
                    tmdb_id: item.id,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    backdrop_path: item.backdrop_path
                },
                trailerKey: trailer ? trailer.key : null,
                reviews: reviews,
                isFavorite: isFavorite,
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
                pageTitle: "Meu Perfil", 
                pageStyle: "profile", 
                pageScript: "front_interactions", // Alterado para o novo script central
                user: { ...req.user, ...userData }, 
                menuProfile: true
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar perfil.");
        }
    }

    async search(req, res) {
        try {
            const q = req.query.q || req.query['name-search'];
            const genre = req.query.genre || req.query['genero-search'];
            
            if (!q && !genre) return res.redirect('/');
            let results = [];

            if (q) {
                results = await tmdbService.search(q);
            } else if (genre) {
                const genreId = Object.keys(GENRE_MAP).find(key => GENRE_MAP[key] === genre);
                if (genreId) results = await tmdbService.discoverGlobal(genreId);
            }

            const generos = Object.values(GENRE_MAP).sort().map(gName => ({
                name: gName,
                isSelected: gName === genre
            }));

            const formatItem = (item) => {
                const date = item.release_date || item.first_air_date;
                return {
                    ...item,
                    type: item.media_type,
                    release_year: date ? date.split('-')[0] : 'N/A',
                    genero: item.genre_ids && item.genre_ids.length > 0 ? getGenreName(item.genre_ids[0]) : "Geral",
                    vote_average: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
                    idioma: item.original_language ? item.original_language.toUpperCase() : "N/A"
                };
            };

            let list = results.map(formatItem);
            if (q && genre) {
                list = list.filter(item => item.genero === genre);
            }

            const filmes = list.filter(i => i.type === 'movie');
            const series = list.filter(i => i.type === 'tv');

            res.render('frontoffice/index', {
                pageTitle: q ? "Resultados para: " + q : "Categoria: " + genre,
                pageStyle: "homepage",
                pageScript: "front_interactions",
                filmes,
                series,
                generos,
                isSearch: true,
                query: q,
                selectedGenre: genre,
                user: req.user,
                menuHome: true
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro na busca.");
        }
    }
}

module.exports = new HomeController();