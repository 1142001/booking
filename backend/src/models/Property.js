import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: ['room', 'pg'], required: true },
    rentPerMonth: { type: Number, required: true, min: 0 },
    deposit: { type: Number, default: 0, min: 0 },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    availableBeds: { type: Number, default: 1, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Property = mongoose.model('Property', propertySchema);
