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
    // --- ATOMIC UPDATE: Use findOneAndUpdate with $inc to prevent race conditions ---
    // Normalize the date for comparison
    const normalizedDate = new Date(date).toLocaleDateString('en-CA');
    
    // Find the experience and atomically decrement the spots
    const experience = await Experience.findOneAndUpdate(
      {
        _id: experienceId,
        'availableSlots.date': new Date(normalizedDate),
        'availableSlots.timeSlots': {
          $elemMatch: {
            time: time,
            spotsLeft: { $gte: quantity } // Ensure enough spots available
          }
        }
      },
      {
        $inc: {
          'availableSlots.$[dateElem].timeSlots.$[timeElem].spotsLeft': -quantity
        }
      },
      {
        arrayFilters: [
          { 'dateElem.date': new Date(normalizedDate) },
          { 'timeElem.time': time }
        ],
        new: true, // Return the updated document
        runValidators: true
      }
    );

    // If no document was found/updated, it means either:
    // 1. Experience doesn't exist
    // 2. Date/time slot doesn't exist
    // 3. Not enough spots available
    if (!experience) {
      // Check if experience exists to give better error message
      const experienceExists = await Experience.findById(experienceId);
      if (!experienceExists) {
        return res.status(404).json({ message: 'Experience not found.' });
      }

      // Check what went wrong
      const dateSlot = experienceExists.availableSlots.find(
        (slot) => new Date(slot.date).toLocaleDateString('en-CA') === normalizedDate
      );
      
      if (!dateSlot) {
        return res.status(400).json({ message: 'Selected date is not available.' });
      }

      const timeSlot = dateSlot.timeSlots.find((slot) => slot.time === time);
      if (!timeSlot) {
        return res.status(400).json({ message: 'Selected time is not available.' });
      }

      // If we got here, not enough spots
      return res.status(400).json({ 
        message: `Not enough spots available. Only ${timeSlot.spotsLeft} spot(s) left.` 
      });
    }
    // --- End Atomic Update ---

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
    
    // If booking creation failed, we need to rollback the spot decrement
    // This is a rare case but important for data consistency
    if (error.name === 'ValidationError' || error.code === 11000) {
      // Try to rollback the spots
      try {
        const normalizedDate = new Date(req.body.date).toLocaleDateString('en-CA');
        await Experience.findOneAndUpdate(
          {
            _id: req.body.experienceId,
            'availableSlots.date': new Date(normalizedDate),
            'availableSlots.timeSlots.time': req.body.time
          },
          {
            $inc: {
              'availableSlots.$[dateElem].timeSlots.$[timeElem].spotsLeft': req.body.quantity
            }
          },
          {
            arrayFilters: [
              { 'dateElem.date': new Date(normalizedDate) },
              { 'timeElem.time': req.body.time }
            ]
          }
        );
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    
    res.status(500).json({ message: 'Server error while creating booking.' });
  }
});

export default router;