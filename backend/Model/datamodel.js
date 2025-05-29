import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  soilMoisture: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;