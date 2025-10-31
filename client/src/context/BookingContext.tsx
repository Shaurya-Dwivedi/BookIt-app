// client/src/context/BookingContext.tsx
import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Experience } from '../types';

// Define the shape of the data in our booking cart
interface BookingDetails {
  experience: Experience | null;
  date: string | null;
  time: string | null;
  quantity: number;
}

// Define the shape of the context itself
interface BookingContextType {
  bookingDetails: BookingDetails;
  setBookingDetails: (details: BookingDetails) => void;
}

// Create the context with a default value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create the Provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage if available
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(() => {
    try {
      const saved = localStorage.getItem('bookingDetails');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading booking details from localStorage:', error);
    }
    return {
      experience: null,
      date: null,
      time: null,
      quantity: 1,
    };
  });

  // Save to localStorage whenever bookingDetails changes
  const updateBookingDetails = (details: BookingDetails) => {
    setBookingDetails(details);
    try {
      localStorage.setItem('bookingDetails', JSON.stringify(details));
    } catch (error) {
      console.error('Error saving booking details to localStorage:', error);
    }
  };

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails: updateBookingDetails }}>
      {children}
    </BookingContext.Provider>
  );
};

// Create a custom hook to easily use the context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};