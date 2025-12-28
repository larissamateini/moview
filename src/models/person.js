const db = require('../database/connection');

class Person {
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM atores_diretores");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM atores_diretores WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(data) {
        const { nome, cargo } = data;
        const [result] = await db.query(
            "INSERT INTO atores_diretores (name, role) VALUES (?, ?)",
            [nome, cargo]
        );
        return result;
    }

    static async update(id, data) {
        const { nome, cargo } = data;
        const [result] = await db.query(
            "UPDATE atores_diretores SET name=?, rolw=? WHERE id=?",
            [nome, cargo, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query("DELETE FROM atores_diretores WHERE id = ?", [id]);
        return result;
    }
}

module.exports = Person;