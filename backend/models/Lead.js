const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  leadSource: {
    type: String,
    enum: ['website', 'whatsapp', 'social', 'phone', 'form'],
    required: true
  },
  status: {
    type: String,
    enum: [
      'New Lead', 'Contacted', 'Requirement Collected',
      'Property Suggested', 'Visit Scheduled', 'Visit Completed',
      'Booked', 'Lost'
    ],
    default: 'New Lead'
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  notes: { type: String, default: '' },
  followUpRequired: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for scalability
leadSchema.index({ phone: 1 });
leadSchema.index({ status: 1 });

module.exports = mongoose.model('Lead', leadSchema);
