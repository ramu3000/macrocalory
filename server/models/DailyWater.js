const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyWaterSchema = new Schema({
  date: { type: Date, required: true },
  desiliters: { type: Number, required: true },
});

module.exports = dailyWaterSchema;
// Don't model to mongoose!