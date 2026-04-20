import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    checkInDate: { type: Date, required: true },
    durationMonths: { type: Number, required: true, min: 1 },
    occupants: { type: Number, default: 1, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
