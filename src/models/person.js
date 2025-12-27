const db = require('../database/connection');

const person = {
    // Read (All)
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM atores_diretores");
        return rows;
    },

    // Read (by ID)
    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM atores_diretores WHERE id = ?", [id]);
        return rows[0];
    },

    // Create
    create: async (data) => {
        const { nome, cargo } = data;
        const [result] = await db.query(
            "INSERT INTO atores_diretores (nome, cargo) VALUES (?, ?)",
            [nome, cargo]
        );
        return result;
    },

    // Update
    update: async (id, data) => {
        const { nome, cargo } = data;
        const [result] = await db.query(
            "UPDATE atores_diretores SET nome=?, cargo=? WHERE id=?",
            [nome, cargo, id]
        );
        return result;
    },

    // Delete
    delete: async (id) => {
        const [result] = await db.query("DELETE FROM atores_diretores WHERE id = ?", [id]);
        return result;
    }
};

module.exports = person;
