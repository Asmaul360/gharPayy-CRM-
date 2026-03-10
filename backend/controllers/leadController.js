const Lead = require('../models/Lead');
const Agent = require('../models/Agent');
const Activity = require('../models/Activity');

let lastAssignedIndex = -1;

const assignAgent = async () => {
  const agents = await Agent.find().sort({ _id: 1 });
  if (agents.length === 0) return null;
  lastAssignedIndex = (lastAssignedIndex + 1) % agents.length;
  const selected = agents[lastAssignedIndex];
  selected.activeLeadsCount += 1;
  await selected.save();
  return selected._id;
};

exports.createLead = async (req, res) => {
  try {
    const { name, phone, leadSource } = req.body;
    let agentId = await assignAgent();
    
    const lead = new Lead({
      name,
      phone,
      leadSource,
      assignedAgent: agentId,
      status: 'New Lead'
    });
    await lead.save();

    if (agentId) {
      await Activity.create({
        leadId: lead._id,
        action: 'Lead Created & Assigned',
        agent: agentId,
        note: 'System auto-assigned via round-robin.'
      });
    }

    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedAgent');
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedAgent');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    // Fetch activities for this lead
    const activities = await Activity.find({ leadId: req.params.id }).sort({ createdAt: -1 });
    
    // Merge into lead object
    const leadObj = lead.toObject();
    leadObj.activities = activities;
    
    res.json(leadObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    // Authorization
    console.log(`Auth Check [Lead Status]: Agent=${req.agent.id}, LeadOwner=${lead.assignedAgent}`);
    if (lead.assignedAgent?.toString() !== req.agent.id) {
      return res.status(403).json({ error: 'Access denied: You are only allowed to update your own leads.' });
    }

    const oldStatus = lead.status;
    lead.status = status;
    // Clearing follow-up flag if status is updated manually
    lead.followUpRequired = false; 
    await lead.save();

    await Activity.create({
      leadId: lead._id,
      action: 'Status Updated',
      note: `Status changed from ${oldStatus} to ${status}`
    });

    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLeadNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    // Authorization
    if (lead.assignedAgent?.toString() !== req.agent.id) {
      return res.status(403).json({ error: 'Access denied: You are only allowed to update your own leads.' });
    }

    lead.notes = notes;
    await lead.save();

    await Activity.create({
      leadId: lead._id,
      action: 'Note Added',
      note: 'Lead notes were updated'
    });

    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { agentId } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    // Authorization: Only current owner can reassign
    if (lead.assignedAgent?.toString() !== req.agent.id) {
      return res.status(403).json({ error: 'Access denied: Only the current owner can reassign this lead.' });
    }

    const oldAgent = lead.assignedAgent;
    lead.assignedAgent = agentId;
    await lead.save();

    // Update agent counts
    if (oldAgent) {
      await Agent.findByIdAndUpdate(oldAgent, { $inc: { activeLeadsCount: -1 }});
    }
    if (agentId) {
      await Agent.findByIdAndUpdate(agentId, { $inc: { activeLeadsCount: 1 }});
    }

    await Activity.create({
      leadId: lead._id,
      action: 'Agent Reassigned',
      note: `Manually reassigned to agent ${agentId}`
    });

    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    if (lead.assignedAgent) {
      await Agent.findByIdAndUpdate(lead.assignedAgent, { $inc: { activeLeadsCount: -1 }});
    }
    await Activity.deleteMany({ leadId: lead._id });
    // also could delete visits
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
