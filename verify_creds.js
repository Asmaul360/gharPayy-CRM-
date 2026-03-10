const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({path: './backend/.env'});

async function verifyLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Agent = require('./backend/models/Agent');
    
    const agents = await Agent.find({});
    console.log('--- Agent Records ---');
    for (const agent of agents) {
      const isMatch = await bcrypt.compare('password123', agent.password);
      console.log(`Email: ${agent.email}, Name: ${agent.name}, Password Match (password123): ${isMatch}`);
    }
    
    if (agents.length === 0) {
      console.log('No agents found in database.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Verification Error:', err);
    process.exit(1);
  }
}

verifyLogin();
