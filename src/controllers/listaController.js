const Lista = require('../models/Lista');
const Conteudo = require('../models/Conteudo');
const Favorito = require('../models/Favorito');

class ListaController {
    // Listagem de todas as listas do utilizador
    async index(req, res) {
        try {
            const listas = await Lista.getByUser(req.user.id);
            res.render('frontoffice/lists/my_lists', {
                listas,
                pageTitle: "Minhas Listas",
                pageStyle: "listas",
                pageScript: "front_interactions",
                user: req.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar listas");
        }
    }

    // Detalhes de uma lista específica (itens dentro dela)
    async show(req, res) {
        try {
            const lista = await Lista.getById(req.params.id);
            if (!lista) return res.status(404).send("Lista não encontrada");
            
            const itens = await Lista.getItens(req.params.id);
            res.render('frontoffice/lists/details', {
                lista,
                itens,
                pageTitle: lista.nome,
                pageStyle: "details-list",
                pageScript: "front_interactions",
                user: req.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar detalhes da lista");
        }
    }

    async renderCreate(req, res) {
        try {
            // Procura os favoritos do utilizador para preencher o campo de seleção
            const meusFavoritos = await Favorito.getByUser(req.user.id);

            res.render('frontoffice/lists/create', {
                pageTitle: "Criar Lista",
                pageStyle: "criar-lista",
                pageScript: "front_interactions",
                favoritos: meusFavoritos,
                user: req.user
            });
        } catch (err) {
            console.error("Erro no render:", err);
            res.status(500).send(err.message);
        }
    }

    // Processa a criação da lista
    async create(req, res) {
        try {
            const { nome, descricao, itens_ids } = req.body;
            const utilizador_id = req.user.id;

            // 1. Criar a lista primeiro
            // O método create do teu Model já retorna o insertId
            const lista_id = await Lista.create(utilizador_id, nome, descricao, true);

            // 2. Adicionar os itens à tabela lista_conteudos
            if (itens_ids && itens_ids.length > 0) {
                // Transformar a string "1,2,3" num array [1, 2, 3]
                const idsArray = itens_ids.split(',');

                for (const conteudo_id of idsArray) {
                    if (conteudo_id) {
                        await Lista.addItem(lista_id, conteudo_id);
                    }
                }
            }

            res.redirect('/listas');
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            res.status(500).send("Erro interno ao criar lista.");
        }
    }

    // Renderiza o formulário de edição
    async renderEdit(req, res) {
        try {
            const lista = await Lista.getById(req.params.id);
            if (!lista) return res.status(404).send("Lista não encontrada");

            // 1. Pegar os itens que já estão nesta lista
            const itensAtuais = await Lista.getItens(req.params.id);
            
            // 2. Pegar os favoritos para o dropdown de adicionar novos
            const meusFavoritos = await Favorito.getByUser(req.user.id);

            res.render('frontoffice/lists/edit', {
                lista,
                itensAtuais, // Enviamos os itens separadamente para facilitar o loop
                favoritos: meusFavoritos,
                pageTitle: "Editar Lista",
                pageStyle: "criar-lista",
                pageScript: "front_interactions",
                user: req.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar formulário de edição");
        }
    }

    // Processa a atualização da lista
    async update(req, res) {
        try {
            const { nome, descricao, publica, itens_ids } = req.body;
            const lista_id = req.params.id;

            // 1. Atualizar dados básicos da lista (Nome, Descrição, etc)
            await Lista.update(lista_id, {
                nome,
                descricao,
                publica: publica === 'on'
            });

            // 2. Sincronizar Itens (apagar e reinserir)
            // Remove todos os itens atuais desta lista na base de dados
            const sqlLimpar = 'DELETE FROM lista_conteudos WHERE lista_id = ?';
            const db = require('../database/connection');
            await db.execute(sqlLimpar, [lista_id]);

            // 3. Inserir os novos itens selecionados (que vêm do array do JS)
            if (itens_ids && itens_ids.length > 0) {
                const idsArray = itens_ids.split(',');
                for (const conteudo_id of idsArray) {
                    if (conteudo_id) {
                        await Lista.addItem(lista_id, conteudo_id);
                    }
                }
            }

            res.redirect('/listas');
        } catch (error) {
            console.error("Erro ao atualizar lista:", error);
            res.status(500).send("Erro ao atualizar lista");
        }
    }

    // Elimina a lista completa
    async delete(req, res) {
        try {
            await Lista.delete(req.params.id);
            // Se for via Fetch (JS)
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ success: true });
            }
            // Se for via formulário normal
            res.redirect('/listas');
        } catch (error) {
            res.status(500).json({ success: false });
        }
    }

    // Adiciona um filme/série a uma lista
    async addItem(req, res) {
        try {
            const { lista_id, ...contentData } = req.body;
            // Garante que o conteúdo existe na nossa BD local (TMDB -> Local)
            const conteudo = await Conteudo.findOrCreate(contentData);
            await Lista.addItem(lista_id, conteudo.id);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }

    // Remove um item específico de uma lista
    async removeItem(req, res) {
        try {
            const { lista_id, conteudo_id } = req.body;
            await Lista.removeItem(lista_id, conteudo_id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false });
        }
    }
}

module.exports = new ListaController();