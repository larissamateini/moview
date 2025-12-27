const Person = require('../models/person');
class PersonController {
    async index(req, res) {
        const rows = await Person.getAll();
        res.render('backoffice/diretores-atores', { data: rows, pageTitle: "Staff" });
    }
    async create(req, res) {
        await Person.create(req.body);
        res.status(201).json({ message: "Pessoa criada" });
    }
    async delete(req, res) {
        await Person.delete(req.params.id);
        res.json({ message: "Registo eliminado" });
    }
}

module.exports = new PersonController();