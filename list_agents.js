const mongoose = require('mongoose');
require('dotenv').config({path: './backend/.env'});

async function listAgents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Agent = require('./backend/models/Agent');
    const agents = await Agent.find({});
    console.log('AGENTS_LIST_START');
    console.log(JSON.stringify(agents.map(a => ({ name: a.name, email: a.email }))));
    console.log('AGENTS_LIST_END');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listAgents();
