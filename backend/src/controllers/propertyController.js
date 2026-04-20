import { Property } from '../models/Property.js';

export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    return res.status(201).json(property);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { type, location, minRent, maxRent } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minRent || maxRent) {
      filter.rentPerMonth = {};
      if (minRent) filter.rentPerMonth.$gte = Number(minRent);
      if (maxRent) filter.rentPerMonth.$lte = Number(maxRent);
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.status(200).json(property);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.status(200).json(property);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isActive = false;
    await property.save();

    return res.status(200).json({ message: 'Property deactivated successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPropertyStats = async (_req, res) => {
  try {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: '$type',
          totalProperties: { $sum: 1 },
          averageRent: { $avg: '$rentPerMonth' }
        }
      }
    ]);

    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
