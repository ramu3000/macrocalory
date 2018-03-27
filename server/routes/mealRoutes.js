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
      var meals = 0;
      if (!_.isEmpty(dateQueryParams)) {
        meals = await Meal.find({date: dateQueryParams}).select('-__v -_user');
      } else {
        meals = await Meal.find().select('-__v -_user');
      }
      res.status(200).json({
        count: meals.length,
        meals: meals
      });
    } catch (err) {
      res.status(500).json({ error: err });
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
