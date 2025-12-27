const Review = require('../models/review');

const reviewController = {
    // GET: Listar todas (Backoffice)
    index: async (req, res) => {
        try {
            const reviews = await Review.getAll();
            res.render('backoffice/reviews', {
                data: reviews,
                pageTitle: "Moderar Reviews"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar reviews");
        }
    },

    // GET: Ver uma específica (JSON)
    show: async (req, res) => {
        try {
            const review = await Review.getById(req.params.id);
            if (review) res.json(review);
            else res.status(404).json({ message: "Review não encontrada" });
        } catch (error) {
            res.status(500).json({ error: "Erro na base de dados" });
        }
    },

    // POST: Criar review
    create: async (req, res) => {
        try {
            await Review.create(req.body);
            res.redirect('/backoffice/reviews');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao criar review");
        }
    },

    // POST: Atualizar review
    update: async (req, res) => {
        try {
            const { id } = req.params;
            await Review.update(id, req.body);
            res.redirect('/backoffice/reviews');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao atualizar review");
        }
    },

    // Eliminar review
    delete: async (req, res) => {
        try {
            await Review.delete(req.params.id);
            res.redirect('/backoffice/reviews');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao eliminar review");
        }
    }
};

module.exports = reviewController;