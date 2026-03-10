const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    let agent = await Agent.findOne({ email });
    
    if (agent) {
      return res.status(400).json({ error: 'Agent already exists' });
    }

    agent = new Agent({ name, email, password, phone });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    agent.password = await bcrypt.hash(password, salt);

    await agent.save();

    // Return JWT
    const payload = { agent: { id: agent._id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, agent: { _id: agent._id, name: agent.name, email: agent.email } });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, agent.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const payload = { agent: { id: agent._id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, agent: { _id: agent._id, name: agent.name, email: agent.email } });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id).select('-password');
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
