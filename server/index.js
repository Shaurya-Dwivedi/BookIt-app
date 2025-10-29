// Import the express library
import express from 'express';
// Import the cors library
import cors from 'cors';
// Import the dotenv library to load environment variables
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// Create an instance of an Express application
const app = express();

// Define the port the server will run on.
// It will use the PORT from the .env file, or 3001 if it's not defined.
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
// Enable CORS for all routes, allowing the frontend to communicate with the backend
app.use(cors());
// Allow the server to parse incoming JSON data
app.use(express.json());

// --- Routes ---
// This is a temporary test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('Hello from the Bookit Server!');
});

// --- Start the Server ---
// Make the server listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});