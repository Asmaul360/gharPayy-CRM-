const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  propertyName: { type: String, required: true },
  visitDate: { type: String, required: true },
  visitTime: { type: String, required: true },
  visitOutcome: {
    type: String,
    enum: ['Interested', 'Not Interested', 'Booked', 'Pending'],
    default: 'Pending'
  },
  scheduledByAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
