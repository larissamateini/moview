const axios = require('axios');

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'pt-PT'
    }
});

const tmdbService = {
    getPopularMovies: async () => {
        try {
            const response = await api.get('/movie/popular');
            return response.data.results;
        } catch (error) {
            console.error("Erro ao buscar filmes no TMDB:", error);
            return [];
        }
    },
    getPopularShows: async () => {
        try {
            const response = await api.get('/tv/popular');
            return response.data.results;
        } catch (error) {
            console.error("Erro ao buscar séries no TMDB:", error);
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

            // FALLBACK: Se a sinopse estiver vazia em PT, busca em EN
            if (!data.overview || data.overview.trim() === "") {
                const enRes = await api.get(`/${type}/${id}`, { params: { language: 'en-US' } });
                data.overview = enRes.data.overview;
            }

            return data;
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

module.exports = { tmdbService, getGenreName, GENRE_MAP };