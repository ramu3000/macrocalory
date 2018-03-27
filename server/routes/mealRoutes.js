const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Meal = mongoose.model('meals');

module.exports = app => {
  app.get('/api/meals', requireLogin, async (req, res) => {
    // If the request has both before and after dates,
    // we return meals between those two dates.
    // Else we return all of the meals.
    try {
      console.log(req.query);
      if (req.query.after && req.query.before) {
        // Get just the meals between date values
        const before = new Date(req.query.before);
        const after = new Date(req.query.after);
        console.log(before);
        console.log(after);
        if (isNaN(before) || isNaN(after)) {
          //Error, bad values
          res.status(400).json({
            error: 'Invalid date arguments'
          });
        } else {
          const meals = await Meal.find({ date: { $gt: after, $lt: before }}).select('-__v -_user');
          res.status(200).json({
            count: meals.length,
            meals: meals
          });
        }
      } else {
        //Get all meals
        const meals = await Meal.find().select('-__v -_user');
        res.status(200).json({
          count: meals.length,
          meals: meals
        });
      }
    } catch (err) {
      if (err instanceof TypeError) {
        res.status(500).json({ message: 'CAST ERROR', error: err });
      } else {
        res.status(500).json({ error: err });
      }
    }
  });

  app.post('/api/meals/new', requireLogin, async (req, res) => {
    const { title, date, ingredients } = req.body;
    const meal = new Meal({
      _id: new mongoose.Types.ObjectId(),
      title,
      date: date,
      ingredients,
      _user: req.user.id
    });
    try {
      await meal.save();
      res.status(200).json({
        message: 'New meal was created',
        createdMeal: meal
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  app.get('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.findById(id).select('-__v -_user');
      if (meal) {
        res.status(200).json(meal);
      } else {
        res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  app.post('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.findById(id);
      const { title, date, ingredients } = req.body;
      if (meal) {
        meal.title = title;
        meal.date = date;
        meal.ingredients = ingredients;
        await meal.save();
        await res.status(200).json({
          message: 'Meal with the given id was modified',
          modifiedMeal: meal
        });
      } else {
        await res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      }
    } catch (err) {
      await res.status(500).json({ error: err });
    }
  });

  app.delete('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.remove({ _id: id });
      if (meal) {
        res.status(200).json({
          message: 'Meal with the given id was deleted',
          id: id
        });
      } else {
        res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
};
