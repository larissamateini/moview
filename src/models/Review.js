const db = require('../database/connection');

const Review = {
    // Read (All) com JOIN para o Backoffice
    getAll: async () => {
        const query = `
            SELECT r.*, u.name as nome_utilizador, c.nome as nome_conteudo 
            FROM reviews r 
            JOIN utilizadores u ON r.utilizador_id = u.id 
            JOIN conteudos c ON r.conteudo_id = c.id`;
        const [rows] = await db.query(query);
        return rows;
    },

    // Read (by ID)
    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [id]);
        return rows[0];
    },

    // Create
    create: async (data) => {
        const { utilizador_id, conteudo_id, classificacao, critica } = data;
        const [result] = await db.query(
            "INSERT INTO reviews (utilizador_id, conteudo_id, classificacao, critica) VALUES (?, ?, ?, ?)",
            [utilizador_id, conteudo_id, classificacao, critica]
        );
        return result;
    },

    // Update
    update: async (id, data) => {
        const { classificacao, critica } = data;
        const [result] = await db.query(
            "UPDATE reviews SET classificacao=?, critica=? WHERE id=?",
            [classificacao, critica, id]
        );
        return result;
    },

    // Delete
    delete: async (id) => {
        const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);
        return result;
    }
};

module.exports = Review;