const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./models/Lead');
const Agent = require('./models/Agent');
const Visit = require('./models/Visit');
const Activity = require('./models/Activity');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gharpayy_crm')
  .then(async () => {
    console.log('MongoDB Connected for Seeding');

    await Lead.deleteMany();
    await Agent.deleteMany();
    await Visit.deleteMany();
    await Activity.deleteMany();

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);

    const agent1 = await Agent.create({ name: 'Alice Smith', email: 'alice@gharpayy.com', password: hash, phone: '9876543210' });
    const agent2 = await Agent.create({ name: 'Bob Jones', email: 'bob@gharpayy.com', password: hash, phone: '9876543211' });

    const leads = await Lead.insertMany([
      { name: 'John Doe', phone: '1112223333', leadSource: 'website', status: 'New Lead', assignedAgent: agent1._id },
      { name: 'Jane Roe', phone: '4445556666', leadSource: 'whatsapp', status: 'Contacted', assignedAgent: agent2._id },
      { name: 'Mike Tyson', phone: '7778889999', leadSource: 'social', status: 'Visit Scheduled', assignedAgent: agent1._id },
      { name: 'Sara Khan', phone: '1231231234', leadSource: 'phone', status: 'Visit Scheduled', assignedAgent: agent2._id }
    ]);

    // Pending visits (ready to be acted on)
    await Visit.insertMany([
      {
        leadId: leads[2]._id,
        propertyName: 'Sunshine Heights',
        visitDate: '2026-04-05',
        visitTime: '11:00 AM',
        scheduledByAgent: agent1._id,
        visitOutcome: 'Pending'
      },
      {
        leadId: leads[3]._id,
        propertyName: 'Green Valley Residency',
        visitDate: '2026-04-07',
        visitTime: '02:00 PM',
        scheduledByAgent: agent2._id,
        visitOutcome: 'Pending'
      },
      {
        leadId: leads[2]._id,
        propertyName: 'Sunset Apartments',
        visitDate: '2026-03-01',
        visitTime: '10:00 AM',
        scheduledByAgent: agent1._id,
        visitOutcome: 'Interested' // Already completed visit in history
      }
    ]);

    console.log('Database Seeded Successfully!');
    console.log('Login Credentials:');
    console.log('  Email: alice@gharpayy.com | Password: password123');
    console.log('  Email: bob@gharpayy.com   | Password: password123');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed Error:', err.message);
    process.exit(1);
  });
