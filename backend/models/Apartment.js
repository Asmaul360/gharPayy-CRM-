const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Single', 'Double', 'Triple', 'Studio'],
    default: 'Single'
  },
  status: {
    type: String,
    enum: ['Available', 'Full', 'Maintenance'],
    default: 'Available'
  },
  roomSize: {
    type: String, // e.g. "120 sq ft"
    trim: true
  },
  amenities: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Apartment', apartmentSchema);
