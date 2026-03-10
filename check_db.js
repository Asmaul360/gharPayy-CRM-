const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const Agent = require('./backend/models/Agent');

async function check() {
  console.log('Connecting...');
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected.');
    const agents = await Agent.find({});
    console.log('Agents found:', agents.length);
    agents.forEach(a => console.log(`- ${a.email}`));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
