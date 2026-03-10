const Lead = require('../models/Lead');
const Visit = require('../models/Visit');
const Agent = require('../models/Agent');

exports.getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New Lead' });
    const bookedLeads = await Lead.countDocuments({ status: 'Booked' });
    
    const totalVisits = await Visit.countDocuments();
    const completedVisits = await Visit.countDocuments({ visitOutcome: { $in: ['Interested', 'Not Interested', 'Booked'] } });

    // pipeline distribution
    const pipelineCounts = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const pipeline = {};
    pipelineCounts.forEach(p => {
      pipeline[p._id] = p.count;
    });

    // agent performance - Simplified robust version
    const agents = await Agent.find().lean();
    
    const agentPerformance = await Promise.all(agents.map(async (agent) => {
        const leadsHandled = await Lead.countDocuments({ assignedAgent: agent._id });
        const visitsScheduled = await Visit.countDocuments({ scheduledByAgent: agent._id });
        const bookings = await Lead.countDocuments({ assignedAgent: agent._id, status: 'Booked' });
        
        return {
            _id: agent._id,
            name: agent.name,
            leadsHandled,
            visitsScheduled,
            bookings
        };
    }));

    res.json({
      totalLeads,
      newLeads,
      bookedLeads,
      totalVisits,
      completedVisits,
      pipeline,
      agentPerformance
    });
  } catch (err) {
    console.error('DASHBOARD ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};
