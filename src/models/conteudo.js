const db = require('../database/connection');

const conteudo = {
    // Read (All)
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM conteudos");
        return rows;
    },

    // Read (by ID)
    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM conteudos WHERE id = ?", [id]);
        return rows[0];
    },

    // Create
    create: async (data) => {
        const { nome, sinopse, duracao, ano_lancamento, tipo, poster_path } = data;
        const [result] = await db.query(
            "INSERT INTO conteudos (nome, sinopse, duracao, ano_lancamento, tipo, poster_path) VALUES (?, ?, ?, ?, ?, ?)",
            [nome, sinopse, duracao, ano_lancamento, tipo || 'Filme', poster_path || null]
        );
        return result;
    },

    // Update
    update: async (id, data) => {
        const { nome, sinopse, duracao, ano_lancamento, tipo, poster_path } = data;
        const [result] = await db.query(
            "UPDATE conteudos SET nome=?, sinopse=?, duracao=?, ano_lancamento=?, tipo=?, poster_path=? WHERE id=?",
            [nome, sinopse, duracao, ano_lancamento, tipo, poster_path, id]
        );
        return result;
    },

    // Delete
    delete: async (id) => {
        const [result] = await db.query("DELETE FROM conteudos WHERE id = ?", [id]);
        return result;
    }
};

module.exports = conteudo;