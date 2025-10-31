// server/models/Experience.js

import mongoose from 'mongoose';


const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g., "09:00 AM"
  spotsLeft: { type: Number, required: true },
});


const dateSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // e.g., "2025-10-22T00:00:00.000Z"
  timeSlots: [timeSlotSchema],
});
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
  availableSlots: [dateSlotSchema],
}, {
  // Adds createdAt and updatedAt timestamps automatically
  timestamps: true,
});

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;