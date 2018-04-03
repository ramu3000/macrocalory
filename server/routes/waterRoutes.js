const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const moment = require('moment');

const Water = mongoose.model('waters');

module.exports = app => {
  app.get('/api/water', requireLogin, async (req, res) => {
    try {
      const water = await Water.findOne({ _user: req.user.id }).select(
        '-__v -_user'
      );
      if (!water) {
        // Problems... DB should always have this document for the user
        return res
          .status(500)
          .json({ error: 'No water document for the user!!!' });
      }

      return res.status(200).json(water);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  app.get('/api/water/:day', requireLogin, async (req, res) => {
    try {
      const day = req.params.day;
      if (!moment(day, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
          error:
            'Illegal day param. Use strictly format YYYY-MM-DD with no time.',
          day: day
        });
      }
      const water = await Water.findOne({ _user: req.user.id }).select(
        '-__v -_user'
      );

      if (!water) {
        // Problems... DB should always have this document for the user
        return res
          .status(500)
          .json({ error: 'No water document for the user!!!' });
      }

      const dailyWater = water.dailyWaters.find(dw => {
        return dw.date === day;
      });

      if (dailyWater == null) {
        // If there is no dailyWater-document, we respond with zero
        return res.status(200).json({ date: day, desiliters: 0 });
      }

      return res.status(200).json(dailyWater);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  app.post('/api/water/:day', requireLogin, async (req, res) => {
    try {
      const day = req.params.day;
      if (!moment(day, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
          error:
            'Illegal day param. Use strictly format YYYY-MM-DD with no time.',
          day: day
        });
      }
      if (req.body.desiliters < 0) {
        return res.status(400).json({
          error: 'Illegal desiliters param. Must be non-negative.'
        });
      }

      const water = await Water.findOne({ _user: req.user.id }).select(
        '-__v -_user'
      );
      if (!water) {
        // Problems... DB should always have this document for the user
        return res
          .status(500)
          .json({ error: 'No water document for the user!!!' });
      }

      const dailyWater = water.dailyWaters.find(dw => {
        return dw.date === day;
      });

      const desiliters = req.body.desiliters;
      if (dailyWater == null) {
        // We save new subdocument
        // Take the day from params
        water.dailyWaters.push({
          date: day,
          desiliters: desiliters
        });
        await water.save();

        return res.status(200).json({ message: 'Saved new daily water' });
      } else {
        if (desiliters === 0) {
          // If desiliters is zero, we remove the document
          water.dailyWaters.id(dailyWater._id).remove();
        } else {
          // We overwrite the subdocument
          dailyWater.desiliters = desiliters;
        }
        await water.save();
        return res.status(200).json({ message: 'Updated daily water' });
      }
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });
};
