const db = require('../database/connection');

class Review {
    static async getAll() {
        const query = `
            SELECT r.*, u.name as nome_utilizador, c.nome as nome_conteudo 
            FROM reviews r 
            JOIN utilizadores u ON r.utilizador_id = u.id 
            JOIN conteudos c ON r.conteudo_id = c.id`;
        const [rows] = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(data) {
        const { utilizador_id, conteudo_id, classificacao, critica } = data;
        const [result] = await db.query(
            "INSERT INTO reviews (utilizador_id, conteudo_id, classificacao, critica) VALUES (?, ?, ?, ?)",
            [utilizador_id, conteudo_id, classificacao, critica]
        );
        return result;
    }

    static async update(id, data) {
        const { classificacao, critica } = data;
        const [result] = await db.query(
            "UPDATE reviews SET classificacao=?, critica=? WHERE id=?",
            [classificacao, critica, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);
        return result;
    }

    static async getByContentId(conteudo_id) {
    const query = `
        SELECT r.*, u.name as nome_utilizador, u.username 
        FROM reviews r 
        JOIN utilizadores u ON r.utilizador_id = u.id 
        WHERE r.conteudo_id = ? 
        ORDER BY r.id DESC`; // As mais recentes aparecem primeiro
    const [rows] = await db.query(query, [conteudo_id]);
    return rows;
}
}

module.exports = Review;