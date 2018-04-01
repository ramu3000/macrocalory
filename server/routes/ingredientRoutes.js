const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.get('/api/ingredients', requireLogin, async (req, res) => {
    // DUMMY API for frontend development purposes
    try {
      if (req.query.q) {
        res.status(200).json({
          count: 3,
          ingredients: [
            {
              id: 8,
              name: 'Omena, kuivattu',
              kcal: 274,
              protein: 0.89,
              carbohydrate: 60.2,
              fat: 0.32
            },
            {
              id: 20,
              name: 'Jauheliha, broilerin',
              kcal: 112,
              protein: 19.27,
              carbohydrate: 0,
              fat: 3.87
            },
            {
              id: 666,
              name: 'Riisi, pitkäjyväinen',
              kcal: 366,
              protein: 8.13,
              carbohydrate: 79.00,
              fat: 1.03
            }
          ]
        });
      } else {
        res.status(200).json({
          count: 0,
          ingredients: []
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
};
