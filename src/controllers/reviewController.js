const Review = require('../models/Review');
class ReviewController {
    async index(req, res) {
        const reviews = await Review.getAll();
        res.render('backoffice/reviews', { 
            data: reviews, 
            pageTitle: "Gestor de Reviews",
            pageStyle: "backoffice" 
        });
    }
    
    async delete(req, res) {
        await Review.delete(req.params.id);
        res.json({ message: "Review eliminada" });
    }
}
module.exports = new ReviewController();