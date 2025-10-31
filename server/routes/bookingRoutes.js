// server/routes/bookingRoutes.js
import express from 'express';
import Booking from '../models/Booking.js';
import Experience from '../models/Experience.js';
import { customAlphabet } from 'nanoid';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', async (req, res) => {
  const { experienceId, userName, userEmail, date, time, quantity, totalPrice } = req.body;

  try {
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found.' });
    }

    // --- Critical Section: Check availability and update spots ---
    let dateSlot = experience.availableSlots.find(
      (slot) => new Date(slot.date).toLocaleDateString('en-CA') === new Date(date).toLocaleDateString('en-CA')
    );
    if (!dateSlot) {
      return res.status(400).json({ message: 'Selected date is not available.' });
    }
    
    let timeSlot = dateSlot.timeSlots.find((slot) => slot.time === time);
    if (!timeSlot) {
      return res.status(400).json({ message: 'Selected time is not available.' });
    }

    if (timeSlot.spotsLeft < quantity) {
      return res.status(400).json({ message: `Not enough spots available. Only ${timeSlot.spotsLeft} left.` });
    }

    // Decrease the spots and save the experience
    timeSlot.spotsLeft -= quantity;
    await experience.save();
    // --- End Critical Section ---

    // Generate a unique booking reference
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 8);
    const bookingRef = nanoid();

    // Create and save the new booking
    const newBooking = new Booking({
      experience: experienceId,
      userName,
      userEmail,
      bookingDate: date,
      bookingTime: time,
      quantity,
      totalPrice,
      bookingRef,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking.' });
  }
});

export default router;