const axios = require('axios');

// Configurações base do TMDB
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'pt-PT'
    }
});

const tmdbService = {
    // Buscar filmes populares para a Homepage
    getPopularMovies: async () => {
        try {
            const response = await api.get('/movie/popular');
            return response.data.results;
        } catch (error) {
            console.error("Erro ao buscar filmes no TMDB:", error);
            return [];
        }
    },

    // Buscar séries populares para a Homepage
    getPopularShows: async () => {
        try {
            const response = await api.get('/tv/popular');
            return response.data.results;
        } catch (error) {
            console.error("Erro ao buscar séries no TMDB:", error);
            return [];
        }
    },

    // Buscar detalhes de um conteúdo específico (para a página de detalhes)
    getDetails: async (type, id) => {
        try {
            // detalhes, créditos (elenco/direção) e vídeos
            const response = await api.get(`/${type}/${id}`, {
                params: {
                    append_to_response: 'credits,videos,release_dates,content_ratings'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar detalhes no TMDB:", error);
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

module.exports = {tmdbService, getGenreName};