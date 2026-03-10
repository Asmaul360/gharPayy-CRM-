const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const Agent = require('./backend/models/Agent');

async function testAuth() {
  console.log('Connecting to:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const agents = await Agent.find().limit(5);
    console.log(`Found ${agents.length} agents.`);

    for (const agent of agents) {
      const isMatch = await bcrypt.compare('password123', agent.password);
      console.log(`- Agent: ${agent.email}, Pass Match: ${isMatch}`);
    }

    if (agents.length === 0) {
      console.log('Database is empty. Running seed...');
    }

    process.exit(0);
  } catch (err) {
    console.error('Failure:', err);
    process.exit(1);
  }
}

testAuth();
