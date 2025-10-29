// server/models/Experience.js

import mongoose from 'mongoose';

// Define the schema for the Experience collection
const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // This field is mandatory
    trim: true,     // Removes whitespace from the beginning and end
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  // We will add slots and dates later on
}, {
  // Adds createdAt and updatedAt timestamps automatically
  timestamps: true,
});

// Create the Experience model from the schema
const Experience = mongoose.model('Experience', experienceSchema);

// Export the model so we can use it in other files
export default Experience;