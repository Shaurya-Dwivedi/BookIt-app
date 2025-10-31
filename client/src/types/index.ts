// client/src/types/index.ts
export interface TimeSlot {
  _id: string;
  time: string;
  spotsLeft: number;
}

export interface DateSlot {
  _id: string;
  date: string; // Will be a string in ISO format
  timeSlots: TimeSlot[];
}

export interface Experience {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  location: string;
  availableSlots: DateSlot[]; // Add this
  createdAt: string;
  updatedAt: string;
}