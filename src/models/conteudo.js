const db = require('../database/connection');

class Conteudo {
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM conteudos");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM conteudos WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(data) {
        const { nome, sinopse, duracao, ano_lancamento, tipo, poster_path } = data;
        const [result] = await db.query(
            "INSERT INTO conteudos (nome, sinopse, duracao, ano_lancamento, tipo, poster_path) VALUES (?, ?, ?, ?, ?, ?)",
            [nome, sinopse, duracao, ano_lancamento, tipo || 'Filme', poster_path || null]
        );
        return result;
    }

    static async update(id, data) {
        const { nome, sinopse, duracao, ano_lancamento, tipo, poster_path } = data;
        const [result] = await db.query(
            "UPDATE conteudos SET nome=?, sinopse=?, duracao=?, ano_lancamento=?, tipo=?, poster_path=? WHERE id=?",
            [nome, sinopse, duracao, ano_lancamento, tipo, poster_path, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query("DELETE FROM conteudos WHERE id = ?", [id]);
        return result;
    }
}

module.exports = Conteudo;