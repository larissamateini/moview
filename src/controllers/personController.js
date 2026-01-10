const Person = require('../models/Person');

class PersonController {
    async index(req, res) {
        try {
            // 1. Capturar o filtro da URL (?role=Ator)
            const { role } = req.query;
            
            // 2. Passar o filtro para o Model
            const rows = await Person.getAll({ role });
            
            const formattedData = rows.map(person => ({
                ...person,
                // Usar badgeClass para combinar com o Mustache que fizemos
                badgeClass: person.role === 'Ator' ? 'badge-ator' : 'badge-diretor'
            }));

            res.render('backoffice/diretores-atores', { 
                data: formattedData, 
                // 3. Flags para manter o select selecionado no frontend
                isAtorSelected: role === 'Ator',
                isDiretorSelected: role === 'Diretor',
                pageTitle: "Gestão de Diretores & Atores",
                pageStyle: "backoffice"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar atores e diretores.");
        }
    }

    async create(req, res) {
        try {
            await Person.create(req.body);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar" });
        }
    }

    async delete(req, res) {
        try {
            await Person.delete(req.params.id);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: "Erro ao eliminar" });
        }
    }
}

module.exports = new PersonController();