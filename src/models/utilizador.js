const db = require('../database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Utilizador {
    static async getAll() {
        const [rows] = await db.query("SELECT id, name, email, role, username FROM utilizadores");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM utilizadores WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(userData) {
        const { fullName, email, username, role, password } = userData;
        const [result] = await db.query(
            "INSERT INTO utilizadores (name, email, username, role, password) VALUES (?, ?, ?, ?, ?)",
            [fullName, email, username, role, password]
        );
        return result;
    }

    static async update(id, userData) {
        const { fullName, email, role } = userData;
        const [result] = await db.query(
            "UPDATE utilizadores SET name=?, email=?, role=? WHERE id=?",
            [fullName, email, role, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query("DELETE FROM utilizadores WHERE id = ?", [id]);
        return result;
    }

    static async register(userData) {
        const { fullName, email, role, password, username } = userData;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await db.query(
            "INSERT INTO utilizadores (name, email, role, password, username) VALUES (?, ?, ?, ?, ?)",
            [fullName, email, role || 'user', hashedPassword, username]
        );
    }

    static async getByCredentials(email, password) {
        const [rows] = await db.query("SELECT * FROM utilizadores WHERE email = ?", [email]);
        const user = rows[0];
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) return user;
        }
        return null;
    }
}

module.exports = Utilizador;