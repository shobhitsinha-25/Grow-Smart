import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  soilMoisture: { type: Number, required: true },
  rainDetected: { type: Boolean, default: false },
  pumpStatus: { type: Boolean, default: false }, 
  fanStatus: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;