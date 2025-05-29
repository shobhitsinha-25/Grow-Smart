import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './Model/usermodel.js';
import Weather from './Model/datamodel.js';
import nodemailer from 'nodemailer';

// Initialize environment variables
dotenv.config();

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

// MongoDB connection
mongoose
  .connect(mongoURI, {
   
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Sign-Up Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists please signIn' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Sign-In Route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
});

app.post('/weather/dummy', async (req, res) => {
  try {
    const dummyData = [
      /*{ temperature: 25, humidity: 60, soilMoisture: 45, timestamp: new Date() },
      { temperature: 28, humidity: 55, soilMoisture: 50, timestamp: new Date() - 3600 * 1000 },
      { temperature: 30, humidity: 65, soilMoisture: 55, timestamp: new Date() - 2 * 3600 * 1000 },
      { temperature: 22, humidity: 70, soilMoisture: 48, timestamp: new Date() - 3 * 3600 * 1000 },
      { temperature: 24, humidity: 50, soilMoisture: 40, timestamp: new Date() - 4 * 3600 * 1000 },
      { temperature: 50, humidity: 30, soilMoisture: 45, timestamp: new Date() - 5 * 3600 * 1000 },
       */
    ];

    // Save all dummy data to the database
    await Weather.insertMany(dummyData);

    res.status(201).json({ message: 'Dummy weather data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving dummy weather data', error });
  }
});


app.get('/weather', async (req, res) => {
  try {
    const weatherData = await Weather.find().sort({ timestamp: -1 }); // Sort by most recent
    if (!weatherData.length) {
      return res.status(404).json({ message: 'No weather data found' });
    }
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving weather data', error });
  }
});

//Forget and reset Password...

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    user.verificationCode = verificationCode;
    user.codeExpiration = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes
    await user.save();

    res.json({ verificationCode, message: 'Verification code generated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
});


app.post('/reset-password', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== verificationCode || user.codeExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = null;
    user.codeExpiration = null;
    await user.save();

    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
});

//POST requuest for sensor data...
app.post('/api/sensor-data', async (req, res) => {
  const { temperature, humidity } = req.body;

  if (!temperature || !humidity) {
    return res.status(400).json({ message: 'Temperature and humidity are required' });
  }

  try {
    const newData = new SensorData({ temperature, humidity });
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error });
  }
});

// running the port....
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
