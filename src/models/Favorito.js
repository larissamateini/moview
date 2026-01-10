const db = require('../database/connection');

class Favorito {
    // Listar favoritos com detalhes do conteúdo (para a página de favoritos)
    static async getByUser(utilizador_id) {
        const sql = `
            SELECT 
                c.id, 
                c.tmdb_id, 
                c.nome, 
                c.poster_path, 
                c.tipo, 
                f.adicionado_em 
            FROM favoritos f
            JOIN conteudos c ON f.conteudo_id = c.id
            WHERE f.utilizador_id = ?
            ORDER BY f.adicionado_em DESC`;
        
        const [rows] = await db.execute(sql, [utilizador_id]);
        return rows;
    }

    // Adicionar favorito (INSERT IGNORE evita erro se já existir)
    static async add(utilizador_id, conteudo_id) {
        const sql = 'INSERT IGNORE INTO favoritos (utilizador_id, conteudo_id) VALUES (?, ?)';
        const [result] = await db.execute(sql, [utilizador_id, conteudo_id]);
        return result;
    }

    //adicionei
    static async isFavorite(utilizador_id, tmdb_id) {
        const sql = `
            SELECT COUNT(*) as total 
            FROM favoritos f
            JOIN conteudos c ON f.conteudo_id = c.id
            WHERE f.utilizador_id = ? AND c.tmdb_id = ?`;
    
        const [rows] = await db.execute(sql, [utilizador_id, tmdb_id]);
        return rows[0].total > 0; // Retorna true se encontrar, false se não
    }

        // Remover Inteligente: Aceita TMDB_ID ou ID Interno
    static async delete(utilizador_id, id_fornecido) {
        // 1. Tenta apagar assumindo que o ID é interno (tabela conteudos.id)
        let sql = 'DELETE FROM favoritos WHERE utilizador_id = ? AND conteudo_id = ?';
        let [result] = await db.execute(sql, [utilizador_id, id_fornecido]);

        // 2. Se não apagou nada, assume que o ID é do TMDB (vindo da Home)
        if (result.affectedRows === 0) {
            // Descobre qual é o ID interno desse TMDB ID
            const [rows] = await db.execute('SELECT id FROM conteudos WHERE tmdb_id = ?', [id_fornecido]);
            
            if (rows.length > 0) {
                const conteudo_id = rows[0].id;
                [result] = await db.execute(sql, [utilizador_id, conteudo_id]);
            }
        }
        return result;
    }
}

module.exports = Favorito;