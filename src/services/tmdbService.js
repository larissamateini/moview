const axios = require('axios');

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'pt-PT'
    }
});

const tmdbService = {
    search: async (query) => {
        try {
            const response = await api.get('/search/multi', {
                params: { query: query }
            });
            return response.data.results;
        } catch (error) {
            console.error("Erro na pesquisa TMDB:", error);
            return [];
        }
    },
    // NOVO: Busca Global por Género (Filmes + Séries)
    discoverGlobal: async (genreId) => {
        try {
            const [movies, tv] = await Promise.all([
                api.get('/discover/movie', { params: { with_genres: genreId } }),
                api.get('/discover/tv', { params: { with_genres: genreId } })
            ]);
            
            // Adicionamos manualmente o media_type, pois o endpoint discover nao traz
            const moviesList = movies.data.results.map(m => ({ ...m, media_type: 'movie' }));
            const tvList = tv.data.results.map(t => ({ ...t, media_type: 'tv' }));
            
            return [...moviesList, ...tvList];
        } catch (error) {
            console.error("Erro no discover TMDB:", error);
            return [];
        }
    },
    getPopularMovies: async () => {
        try {
            const response = await api.get('/movie/popular');
            return response.data.results;
        } catch (error) {
            return [];
        }
    },
    getPopularShows: async () => {
        try {
            const response = await api.get('/tv/popular');
            return response.data.results;
        } catch (error) {
            return [];
        }
    },
    getDetails: async (type, id) => {
        try {
            const response = await api.get(`/${type}/${id}`, {
                params: {
                    append_to_response: 'credits,videos,release_dates,content_ratings',
                    include_video_language: 'pt-PT,en-US,en' 
                }
            });
            
            let data = response.data;
            if (!data.overview || data.overview.trim() === "") {
                const enRes = await api.get(`/${type}/${id}`, { params: { language: 'en-US' } });
                data.overview = enRes.data.overview;
            }
            return data;
        } catch (error) {
            return null;
        }
    }
};

const GENRE_MAP = {
    28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia', 80: 'Crime',
    99: 'Documentário', 18: 'Drama', 10751: 'Família', 14: 'Fantasia',
    36: 'História', 27: 'Terror', 10402: 'Música', 9648: 'Mistério',
    10749: 'Romance', 878: 'Ficção Científica', 10770: 'Cinema TV',
    53: 'Thriller', 10752: 'Guerra', 37: 'Faroeste', 10759: 'Ação e Avent.',
    10765: 'Sci-Fi & Fantasy'
};

function getGenreName(id) {
    return GENRE_MAP[id] || 'Geral';
}

module.exports = { tmdbService, getGenreName, GENRE_MAP };