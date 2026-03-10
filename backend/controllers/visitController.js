const Visit = require('../models/Visit');
const Activity = require('../models/Activity');

exports.scheduleVisit = async (req, res) => {
  try {
    const { leadId, propertyName, visitDate, visitTime, scheduledByAgent } = req.body;
    
    const visit = new Visit({
      leadId,
      propertyName,
      visitDate,
      visitTime,
      scheduledByAgent
    });
    
    await visit.save();

    await Activity.create({
      leadId,
      action: 'Visit Scheduled',
      agent: scheduledByAgent,
      note: `Visit scheduled at ${propertyName} on ${visitDate} at ${visitTime}`
    });

    res.status(201).json(visit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getVisits = async (req, res) => {
  try {
    const visits = await Visit.find().populate('leadId').populate('scheduledByAgent');
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOutcome = async (req, res) => {
  try {
    const { outcome } = req.body;
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ error: 'Visit not found' });

    const validOutcomes = ['Pending', 'Interested', 'Not Interested', 'Booked'];
    if (!validOutcomes.includes(outcome)) {
      return res.status(400).json({ error: `Invalid outcome. Must be one of: ${validOutcomes.join(', ')}` });
    }

    visit.visitOutcome = outcome;
    await visit.save();

    await Activity.create({
      leadId: visit.leadId,
      action: 'Visit Outcome Updated',
      note: `Visit outcome set to "${outcome}" by agent ${req.agent.id}`
    });

    res.json(visit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

