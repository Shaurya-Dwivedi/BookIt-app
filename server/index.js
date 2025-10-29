// In server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import mongoose

import experienceRoutes from './routes/experienceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
  try {
    // Try to connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    // If there's an error, log it and exit the process
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Call the function to connect to the database
connectDB();

// // --- Routes ---
// app.get('/', (req, res) => {
//   res.send('Hello from the Bookit Server!');
// });


// --- Use the Routes ---
// Any request starting with /api/experiences will be handled by our experienceRoutes
app.use('/api/experiences', experienceRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});