const mongoose = require('mongoose');
const { Schema } = mongoose;
const DailyWaterSchema = require('./DailyWater');

const waterSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  dailyWaters: { type: [DailyWaterSchema], required: true },
  _user: { type: Schema.Types.ObjectId , ref: 'User', required: true }
});

mongoose.model('waters', waterSchema);