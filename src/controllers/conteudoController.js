const Conteudo = require('../models/Conteudo');
const axios = require('axios');

class ConteudoController {
    async index(req, res) {
        try {
            const { q, type } = req.query; // Captura os filtros da URL
            
            const rows = await Conteudo.getAll({ q, type });
            
            res.render('backoffice/conteudos', {
                data: rows,
                query: q, // Para manter o texto na barra de busca
                type: type, // Para o select saber o que está selecionado
                isMovieSelected: type === 'movie',
                isTVSelected: type === 'tv',
                pageTitle: "Gestor de Conteúdos",
                pageStyle: "backoffice"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao listar conteúdos");
        }
    }

    async show(req, res) {
        try {
            const row = await Conteudo.getById(req.params.id);
            if (row) res.json(row);
            else res.status(404).json({ message: "Não encontrado" });
        } catch (error) {
            res.status(500).json({ error: "Erro na BD" });
        }
    }

    async create(req, res) {
        try {
            // Usar findOrCreate é mais seguro porque se tentares adicionar 
            // um filme que já existe (pelo tmdb_id), ele não cria um erro de duplicado.
            const novoConteudo = await Conteudo.findOrCreate(req.body);
            res.status(201).json({ message: "Criado com sucesso", id: novoConteudo.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao criar conteúdo na BD" });
        }
    }

    async update(req, res) {
        try {
            await Conteudo.update(req.params.id, req.body);
            res.json({ message: "Atualizado com sucesso" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar" });
        }
    }

    async delete(req, res) {
        try {
            await Conteudo.delete(req.params.id);
            res.json({ message: "Eliminado com sucesso" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao eliminar" });
        }
    }

    // 1. Pesquisa por nome
    async searchTmdb(req, res) {
        const { q } = req.query;
        const apiKey = process.env.TMDB_API_KEY; // Certifique-se que está no .env
        
        if (!q) return res.json([]);

        try {
            // Busca multi (filmes e séries) em Português
            const response = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
                params: {
                    api_key: apiKey,
                    query: q,
                    language: 'pt-PT',
                    include_adult: false
                }
            });
            
            // Filtra apenas filmes e séries (remove pessoas)
            const results = response.data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
            res.json(results);
        } catch (error) {
            console.error("Erro TMDB Search:", error.message);
            res.status(500).json({ error: "Erro ao comunicar com TMDB" });
        }
    }

    // 2. Detalhes completos (para pegar a duração correta)
    async getTmdbDetails(req, res) {
        const { id, type } = req.params; // type deve ser 'movie' ou 'tv'
        const apiKey = process.env.TMDB_API_KEY;

        try {
            const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
                params: { api_key: apiKey, language: 'pt-PT' }
            });
            res.json(response.data);
        } catch (error) {
            console.error("Erro TMDB Details:", error.message);
            res.status(500).json({ error: "Erro ao buscar detalhes" });
        }
    }
}

module.exports = new ConteudoController();