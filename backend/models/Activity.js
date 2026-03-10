const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  action: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
