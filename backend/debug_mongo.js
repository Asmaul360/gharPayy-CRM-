const mongoose = require('mongoose');
require('dotenv').config();

async function debug() {
  console.log('URI:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('ReadyState:', mongoose.connection.readyState);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const Agent = require('./models/Agent');
    const agent = await Agent.findOne();
    console.log('First Agent:', agent ? agent.email : 'None found');
    
    process.exit(0);
  } catch (err) {
    console.error('Debug Error:', err);
    process.exit(1);
  }
}

debug();
