import { Booking } from '../models/Booking.js';
import { Property } from '../models/Property.js';

export const createBooking = async (req, res) => {
  try {
    const { property, checkInDate, durationMonths, occupants, notes } = req.body;

    const selectedProperty = await Property.findById(property);
    if (!selectedProperty || !selectedProperty.isActive) {
      return res.status(404).json({ message: 'Property not available' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      property,
      checkInDate,
      durationMonths,
      occupants,
      notes
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone role')
      .populate('property', 'title location type rentPerMonth')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('property', 'title location');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
