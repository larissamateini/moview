const Person = require('../models/Person');

class PersonController {
    async index(req, res) {
    try {
        const rows = await Person.getAll();
        
        // Mapeamos os dados para adicionar as flags de CSS
        const formattedData = rows.map(person => ({
            ...person,
            isDiretor: person.cargo === 'Diretor',
            isAtor: person.cargo === 'Ator'
        }));

        res.render('backoffice/diretores-atores', { 
            data: formattedData, 
            pageTitle: "Gestão de Diretores & Atores",
            pageStyle: "backoffice",
            pageScript: "diretores-atores"
        });
    } catch (error) {
        res.status(500).send("Erro ao carregar atores e diretores.");
    }
}

    async create(req, res) {
        try {
            await Person.create(req.body);
            res.redirect('/backoffice/diretores-atores');
        } catch (error) {
            res.status(500).send("Erro ao criar ator/diretor");
        }
    }

    async delete(req, res) {
        try {
            await Person.delete(req.params.id);
            res.redirect('/backoffice/diretores-atores');
        } catch (error) {
            res.status(500).send("Erro ao eliminar");
        }
    }
}

module.exports = new PersonController();