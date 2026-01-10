const db = require('../database/connection');

class Review {
    static async getAll(searchTerm = '') {
        // 1. Usamos ALIAS (AS) que combinem exatamente com o Mustache
        let sql = `
            SELECT r.*, 
                u.name AS utilizador_nome, 
                c.nome AS conteudo_nome 
            FROM reviews r 
            JOIN utilizadores u ON r.utilizador_id = u.id 
            JOIN conteudos c ON r.conteudo_id = c.id
            WHERE 1=1`;
        
        const params = [];

        // 2. Lógica para o filtro de pesquisa
        if (searchTerm) {
            sql += " AND r.critica LIKE ?";
            params.push(`%${searchTerm}%`);
        }

        sql += " ORDER BY r.data_review DESC";

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM reviews WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(data) {
        const { utilizador_id, conteudo_id, classificacao, critica } = data;
        const [result] = await db.execute(
            "INSERT INTO reviews (utilizador_id, conteudo_id, classificacao, critica) VALUES (?, ?, ?, ?)",
            [utilizador_id, conteudo_id, classificacao, critica]
        );
        return result;
    }

    static async update(id, data) {
        const { classificacao, critica } = data;
        const [result] = await db.execute(
            "UPDATE reviews SET classificacao=?, critica=? WHERE id=?",
            [classificacao, critica, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM reviews WHERE id = ?", [id]);
        return result;
    }

    static async incrementUtility(id) {
        // 1. Usar o nome exato da tua coluna: votos_utilidade
        await db.execute(
            "UPDATE reviews SET votos_utilidade = votos_utilidade + 1 WHERE id = ?",
            [id]
        );

        // 2. Procurar o novo valor
        const [rows] = await db.execute(
            "SELECT votos_utilidade FROM reviews WHERE id = ?",
            [id]
        );
        
        return rows[0].votos_utilidade;
    }

    static async getByContentId(conteudo_id) {
        const query = `
            SELECT r.*, 
                u.name AS nome_utilizador, 
                u.username,
                r.votos_utilidade,
                DATE_FORMAT(r.data_review, '%d/%m/%Y') AS data_formatada
            FROM reviews r 
            JOIN utilizadores u ON r.utilizador_id = u.id 
            WHERE r.conteudo_id = ? 
            ORDER BY r.data_review DESC`;
        const [rows] = await db.execute(query, [conteudo_id]);
        return rows;
    }
}

module.exports = Review;