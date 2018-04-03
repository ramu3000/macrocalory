//const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const moment = require('moment');

// const Water = mongoose.model('waters');

module.exports = app => {
  app.get('/api/water', requireLogin, async (req, res) => {
    try {
      return res.status(200).json({
        message: 'Ok!'
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  app.get('/api/water/:date', requireLogin, async (req, res) => {
    try {
      const day = req.params.day;

      if (!moment(day, 'YYYY-MM-DD', true).isValid()) {
        return res.status(404).json({
          message:
            'Illegal day param. Use strictly format YYYY-MM-DD with no time.',
          day: day
        });
      }
      return res.status(200).json({
        message: 'Ok!',
        day: day
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  app.post('/api/water/:day', requireLogin, async (req, res) => {
    try {
      const day = req.params.day;

      if (!moment(day, 'YYYY-MM-DD', true).isValid()) {
        return res.status(404).json({
          message:
            'Illegal day param. Use strictly format YYYY-MM-DD with no time.',
          day: day
        });
      }
      return res.status(200).json({
        message: 'Ok!',
        day: day
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });
};
