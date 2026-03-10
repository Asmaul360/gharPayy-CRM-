const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('./models/Agent');
const Lead = require('./models/Lead');
const Visit = require('./models/Visit');

dotenv.config();

const debug = async () => {
  console.log('Starting debug script...');
  console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { 
        family: 4,
        serverSelectionTimeoutMS: 5000 
    });
    console.log('Connected successfully');

    const agents = await Agent.find();
    console.log('Agents count:', agents.length);
    if (agents.length > 0) {
        console.log('First agent ID:', agents[0]._id);
    }

    const leads = await Lead.find();
    console.log('Leads count:', leads.length);
    if (leads.length > 0) {
        console.log('First lead assignedAgent:', leads[0].assignedAgent);
        console.log('First lead status:', leads[0].status);
    }

    const visits = await Visit.find();
    console.log('Visits count:', visits.length);
    if (visits.length > 0) {
        console.log('First visit scheduledByAgent:', visits[0].scheduledByAgent);
    }

    const agentPerformance = await Agent.aggregate([
      {
        $lookup: {
          from: 'leads',
          localField: '_id',
          foreignField: 'assignedAgent',
          as: 'leads'
        }
      },
      {
        $lookup: {
          from: 'visits',
          localField: '_id',
          foreignField: 'scheduledByAgent',
          as: 'visits'
        }
      },
      {
        $project: {
          name: 1,
          leadsHandled: { $size: "$leads" },
          visitsScheduled: { $size: "$visits" },
          bookings: {
            $size: {
              $filter: {
                input: "$leads",
                as: "lead",
                cond: { $eq: ["$$lead.status", "Booked"] }
              }
            }
          }
        }
      }
    ]);

    console.log('Aggregation result:', JSON.stringify(agentPerformance, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err);
    process.exit(1);
  }
};

debug();
