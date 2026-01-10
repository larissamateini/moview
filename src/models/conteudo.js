const db = require('../database/connection');

class Conteudo {
    static async getAll(filters = {}) {
        let sql = "SELECT * FROM conteudos WHERE 1=1";
        const params = [];

        // Filtro por Nome (Busca parcial)
        if (filters.q) {
            sql += " AND nome LIKE ?";
            params.push(`%${filters.q}%`);
        }

        // Filtro por Tipo (movie ou tv)
        if (filters.type) {
            sql += " AND tipo = ?";
            params.push(filters.type);
        }

        sql += " ORDER BY criado_em DESC";

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    // Adiciona este método para o Controller conseguir carregar os dados no Modal de edição
    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM conteudos WHERE id = ?", [id]);
        return rows[0];
    }

    // Tornamos o tipo opcional para evitar erros no Controller de Favoritos
    static async getByTmdbId(tmdbId, type = null) {
        if (type) {
            const [rows] = await db.execute("SELECT * FROM conteudos WHERE tmdb_id = ? AND tipo = ?", [tmdbId, type]);
            return rows[0];
        }
        const [rows] = await db.execute("SELECT * FROM conteudos WHERE tmdb_id = ?", [tmdbId]);
        return rows[0];
    }

    static async findOrCreate(data) {
    // 1. Verificar se já existe na BD
    const sqlSelect = 'SELECT * FROM conteudos WHERE tmdb_id = ?';
    const [rows] = await db.execute(sqlSelect, [data.tmdb_id]);

    if (rows.length > 0) return rows[0];

    // 2. Se não existir, criar. 
    // Usamos || null para garantir que nada vá como "undefined"
    const sqlInsert = `
        INSERT INTO conteudos (tmdb_id, nome, poster_path, tipo, sinopse) 
        VALUES (?, ?, ?, ?, ?)`;

    // Mapeamento de nomes (o que vem do JS vs o que está na BD)
    const values = [
        data.tmdb_id,
        data.title || data.nome || 'Sem título',
        data.poster_path || null,
        data.media_type || data.tipo || 'movie',
        data.overview || data.sinopse || null
    ];

    const [result] = await db.execute(sqlInsert, values);
    return { id: result.insertId, ...data };
}

    static async update(id, data) {
        const { nome, sinopse, duracao, ano_lancamento, tipo, poster_path, backdrop_path } = data;
        const [result] = await db.execute(
            "UPDATE conteudos SET nome=?, sinopse=?, duracao=?, ano_lancamento=?, tipo=?, poster_path=?, backdrop_path=? WHERE id=?",
            [nome, sinopse, duracao, ano_lancamento, tipo, poster_path, backdrop_path, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM conteudos WHERE id = ?", [id]);
        return result;
    }
}

module.exports = Conteudo;