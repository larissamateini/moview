const db = require('../database/connection');

class Lista {
    static async getByUser(utilizador_id) {
        const sql = 'SELECT * FROM listas WHERE utilizador_id = ? ORDER BY criado_em DESC';
        const [rows] = await db.execute(sql, [utilizador_id]);
        return rows;
    }

    static async getAll() {
        const sql = `
            SELECT l.*, u.username as criador 
            FROM listas l
            JOIN utilizadores u ON l.utilizador_id = u.id
            ORDER BY l.criado_em DESC`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getById(lista_id) {
        const sqlLista = 'SELECT * FROM listas WHERE id = ?';
        const [rowsLista] = await db.execute(sqlLista, [lista_id]);
        return rowsLista.length > 0 ? rowsLista[0] : null;
    }

    // Adicionado para o Controller conseguir listar os itens separadamente
    static async getItens(lista_id) {
        const sqlItems = `
            SELECT c.*, lc.adicionado_em
            FROM lista_conteudos lc
            JOIN conteudos c ON lc.conteudo_id = c.id
            WHERE lc.lista_id = ?
            ORDER BY lc.adicionado_em DESC`;
        const [rowsItems] = await db.execute(sqlItems, [lista_id]);
        return rowsItems;
    }

    static async create(utilizador_id, nome, descricao, publica = true) {
        const sql = 'INSERT INTO listas (utilizador_id, nome, descricao, publica) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [utilizador_id, nome, descricao, publica]);
        return result.insertId;
    }

    static async addItem(lista_id, conteudo_id) {
        const sql = 'INSERT IGNORE INTO lista_conteudos (lista_id, conteudo_id) VALUES (?, ?)';
        const [result] = await db.execute(sql, [lista_id, conteudo_id]);
        return result;
    }

    static async update(lista_id, { nome, descricao, publica }) {
        const sql = 'UPDATE listas SET nome = ?, descricao = ?, publica = ? WHERE id = ?';
        const isPublic = publica ? 1 : 0;            
        const [result] = await db.execute(sql, [nome, descricao, isPublic, lista_id]);
        return result;
    }

    // Renomeado para removeItem para bater com o Controller
    static async removeItem(lista_id, conteudo_id) {
        const sql = 'DELETE FROM lista_conteudos WHERE lista_id = ? AND conteudo_id = ?';
        const [result] = await db.execute(sql, [lista_id, conteudo_id]);
        return result;
    }

    static async delete(lista_id) {
        const sql = 'DELETE FROM listas WHERE id = ?';
        const [result] = await db.execute(sql, [lista_id]);
        return result;
    }
}

module.exports = Lista;