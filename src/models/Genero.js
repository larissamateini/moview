const db = require('../database/connection');

class Genero {
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM generos ORDER BY nome ASC");
        return rows;
    }

    static async create(nome) {
        const [result] = await db.query("INSERT INTO generos (nome) VALUES (?)", [nome]);
        return result;
    }

    static async delete(id) {
        const [result] = await db.query("DELETE FROM generos WHERE id = ?", [id]);
        return result;
    }
}

module.exports = Genero;
