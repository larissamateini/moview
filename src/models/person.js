const db = require('../database/connection');

class Person {
    static async getAll(filters = {}) {
        let sql = "SELECT * FROM atores_diretores WHERE 1=1";
        const params = [];

        if (filters.role && filters.role !== "") {
            sql += " AND role = ?";
            params.push(filters.role);
        }

        sql += " ORDER BY name ASC";
        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async create(data) {
        // SQL atualizado: apenas name e role
        const { nome, cargo } = data; 
        const [result] = await db.execute(
            "INSERT INTO atores_diretores (name, role) VALUES (?, ?)",
            [nome, cargo]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM atores_diretores WHERE id = ?", [id]);
        return result;
    }
}

module.exports = Person;