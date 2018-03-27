const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');

const Meal = mongoose.model('meals');

module.exports = app => {
  app.get('/api/meals', requireLogin, async (req, res) => {
    // before and after are optional params for getting
    // only meals before or/and after specific date
    try {
      const dateQueryParams = {};
      if (req.query.after) {
        const after = new Date(req.query.after);
        if (!isNaN(after)) {
          dateQueryParams.$gt = after;
        }
      }
      if (req.query.before) {
        const before = new Date(req.query.before);
        if (!isNaN(before)) {
          dateQueryParams.$lt = before;
        }
      }
      const queryParams = { _user: req.user.id };
      if (!_.isEmpty(dateQueryParams)) {
        queryParams.date = dateQueryParams;
      }
      const meals = await Meal.find(queryParams).select('-__v -_user');
      res.status(200).json({
        count: meals.length,
        meals: meals
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  app.post('/api/meals/new', requireLogin, async (req, res) => {
    const { name, date, ingredients } = req.body;
    const meal = new Meal({
      _id: new mongoose.Types.ObjectId(),
      name,
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
      const meal = await Meal.findOne({ _id: id, _user: req.user.id }).select(
        '-__v -_user'
      );
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
      const meal = await Meal.findOne({ _id: id, _user: req.user.id });
      
      const { name, date, ingredients } = req.body;
      if (meal) {
        meal.name = name;
        meal.date = date;
        meal.ingredients = ingredients;
        await meal.save();
        res.status(200).json({
          message: 'Meal with the given id was overwritten',
          overwrittenMeal: meal
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

  app.delete('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.remove({ _id: id, _user: req.user.id });
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
