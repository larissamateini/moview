const db = require('../database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Utilizador = {
    // CRUD: Read (All)
    getAll: async () => {
        const [rows] = await db.query("SELECT id, name, email, role, username FROM utilizadores");
        return rows;
    },

    // CRUD: Read (by ID)
    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM utilizadores WHERE id = ?", [id]);
        return rows[0];
    },

    // CRUD: Create
    create: async (userData) => {
        const { fullName, email, username, role, password, confirmPassword } = userData;
        const [result] = await db.query(
            "INSERT INTO utilizadores (name, email, username, role, password) VALUES (?, ?, ?, ?, ?)",
            [fullName, email, username, role, password]
        );
        return result;
    },

    // CRUD: Update
    update: async (id, userData) => {
        const { fullName, email, role } = userData;
        const [result] = await db.query(
            "UPDATE utilizadores SET name=?, email=?, role=? WHERE id=?",
            [fullName, email, role, id]
        );
        return result;
    },

    // CRUD: Delete
    delete: async (id) => {
        const [result] = await db.query("DELETE FROM utilizadores WHERE id = ?", [id]);
        return result;
    },

    // Registo com Hash
    register: async (userData) => {
        const { fullName, email, role, password, username } = userData;

        // Criar o hash da password antes de inserir na BD
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return await db.query(
            "INSERT INTO utilizadores (name, email, role, password, username) VALUES (?, ?, ?, ?, ?)",
            [fullName, email, role || 'user', hashedPassword, username]
        );
    },

    // Login com verificação de Hash
    getByCredentials: async (email, password) => {
        // 1. Primeiro procuramos o utilizador apenas pelo email
        const [rows] = await db.query("SELECT * FROM utilizadores WHERE email = ?", [email]);
        const user = rows[0];

        if (user) {
            // 2. Comparamos a password em texto limpo com o hash da BD
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return user; // Passwords coincidem
            }
        }
        return null; // Utilizador não encontrado ou password errada
    }
};

module.exports = Utilizador;