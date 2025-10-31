// server/routes/experienceRoutes.js

import express from 'express';
import Experience from '../models/Experience.js'; // Import the model

// Create a new router instance
const router = express.Router();

// --- Define the Route ---
// @route   GET /api/experiences
// @desc    Get all experiences
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Use the Experience model to find all documents in the experiences collection
    const experiences = await Experience.find({});
    // Send the found experiences back to the client as JSON
    res.json(experiences);
  } catch (error) {
    // If an error occurs, send a 500 server error response
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      // If no experience is found with that ID, return a 404 error
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.json(experience);
  } catch (error) {
    console.error('Error fetching single experience:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// We will add more routes here later

// Export the router
export default router;