const db = require('../database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Utilizador {
    static async getAll(filters = {}) {
        let sql = "SELECT * FROM utilizadores WHERE 1=1";
        const params = [];

        // Filtro por ID exato
        if (filters.id_filter) {
            sql += " AND id = ?";
            params.push(filters.id_filter);
        }

        // Filtro por Role
        if (filters.role) {
            sql += " AND role = ?";
            params.push(filters.role);
        }

        sql += " ORDER BY id DESC";
        const [rows] = await db.execute(sql, params);
        return rows;
    }
    
    static async getById(id) {
        const [rows] = await db.execute("SELECT id, name, email, role, username, created_at FROM utilizadores WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(userData) {
        const { fullName, email, username, role, password } = userData;
        const [result] = await db.execute(
            "INSERT INTO utilizadores (name, email, username, role, password) VALUES (?, ?, ?, ?, ?)",
            [fullName, email, username, role || 'user', password]
        );
        return result;
    }

    static async update(id, userData) {
        const { fullName, email, role, username } = userData;
        const [result] = await db.execute(
            "UPDATE utilizadores SET name=?, email=?, role=?, username=? WHERE id=?",
            [fullName, email, role, username, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM utilizadores WHERE id = ?", [id]);
        return result;
    }

    static async register(userData) {
        const { fullName, email, username, password, role } = userData;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // CORREÇÃO AQUI: Mudado de 'user' para a variável role
        const [result] = await db.execute(
            "INSERT INTO utilizadores (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)",
            [fullName, email, username, hashedPassword, role || 'user']
        );
        return result;
    }

    static async getByCredentials(email, password) {
        const [rows] = await db.execute("SELECT * FROM utilizadores WHERE email = ?", [email]);
        const user = rows[0];
        
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) return user;
        }
        return null;
    }
}

module.exports = Utilizador;