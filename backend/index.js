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
    console.log(user.username);

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
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
});

app.post('/api/sensor-data', async (req, res) => {
  const { temperature, humidity, soilMoisture,rainDetected  } = req.body;

  if (
    temperature === undefined ||
    humidity === undefined ||
    soilMoisture === undefined ||
    rainDetected === undefined
  ) {
    return res.status(400).json({
      message: 'Temperature, humidity, and soilMoisture are required',
    });
  }

  try {
    const newData = new Weather({
      temperature,
      humidity,
      soilMoisture,
      rainDetected: rainDetected ?? false
    });
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error });
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

    // Generate and save verification code + expiration
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    user.verificationCode = verificationCode;
    user.codeExpiration = Date.now() + 2 * 60 * 1000; // 10 minutes
    await user.save();

    // Setup nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,   
        pass: process.env.EMAIL_PASS,   
      },
    });

    const mailOptions = {
      from: `"Grow Smart Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #444; border-radius: 8px; padding: 24px; background-color: #000000;">
  <h2 style="color: #ffffff; text-align: center; margin-bottom: 24px;">🔐 Password Reset Code</h2>

  <p style="font-size: 16px; color: #dddddd; line-height: 1.5;">
    Hello ${user.username},
    <br><br>
    You recently requested to reset your password. Please use the verification code below to complete the process:
  </p>

  <div style="text-align: center; margin: 24px 0;">
    <span style="display: inline-block; font-size: 28px; color: #ffffff; font-weight: bold; background-color: #1b5e20; padding: 12px 24px; border-radius: 8px; border: 2px dashed #66bb6a;">
      ${verificationCode}
    </span>
  </div>

  <p style="font-size: 14px; color: #cccccc; text-align: center;">
    This code will expire in <strong style="color: #ffffff;">2 minutes</strong>.
  </p>

  <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 24px;">
    If you didn’t request this, you can safely ignore this email.
  </p>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Verification code sent to your email.' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
});


app.post('/reset-password', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  if (!email || !verificationCode || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if code matches and hasn't expired
    const isCodeValid =
      user.verificationCode === verificationCode &&
      user.codeExpiration &&
      user.codeExpiration > Date.now();

    if (!isCodeValid) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear verification details
    user.verificationCode = null;
    user.codeExpiration = null;

    await user.save();

    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
});

//POST requuest for sensor data...
app.post('/api/sensor-data', async (req, res) => {
  const { temperature, humidity, soilMoisture } = req.body;

  if (
    temperature === undefined ||
    humidity === undefined ||
    soilMoisture === undefined
  ) {
    return res.status(400).json({
      message: 'Temperature, humidity, and soilMoisture are required',
    });
  }

  try {
    const newData = new Weather({ temperature, humidity, soilMoisture });
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
