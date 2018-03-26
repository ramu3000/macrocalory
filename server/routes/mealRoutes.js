const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Meal = mongoose.model('meals');

module.exports = app => {
  app.get('/api/meals', requireLogin, async (req, res) => {
    try {
      const meals = await Meal.find();
      await res.status(200).json({
        message: 'Returning all the saved meals',
        savedMeals: meals
      });
    } catch (err) {
      await res.status(500).json(err);
    }
  });

  app.post('/api/meals/new', requireLogin, async (req, res) => {
    const { title, ingredients } = req.body;

    const meal = new Meal({
      _id: new mongoose.Types.ObjectId(),
      title: title,
      date: Date.now(),
      ingredients,
      _user: req.user.id
    });

    try {
      await meal.save();
      await res.status(200).json({
        message: 'New meal was created',
        createdMeal: meal
      });
      
    } catch (err) {
      await res.status(500).send(err);
    }
  });
  

  
  app.get('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.findById(id);
      if (meal) {
        await res.status(200).json(meal);
      }
      else {
        await res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      }
    } catch (err) {
      await res.status(500).json(err);
    }
  });

  app.post('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.findById(id);
      const { title, ingredients } = req.body;
      if (meal) {
        meal.title = title;
        meal.ingredients = ingredients;
        await meal.save();
        await res.status(200).json({
          message: 'Meal was modified',
          createdMeal: meal
        });
      }
      else {
        await res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      }
    } catch (err) {
      await res.status(500).json(err);
    }
  });

  app.delete('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.remove({_id: id});

      if (meal) {
        await res.status(200).json({
          message: 'Meal with the given id was deleted',
          id: id
        });
      }
      else {
        await res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      }
    } catch (err) {
      await res.status(500).json(err);
    }
  });
};