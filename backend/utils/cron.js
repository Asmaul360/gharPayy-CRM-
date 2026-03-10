const cron = require('node-cron');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// Run daily at midnight: '0 0 * * *'
// Or every minute for testing: '* * * * *'
// The requirement: "If a lead remains inactive for 24 hours: Trigger a reminder notification. Use a cron job to check inactive leads daily."
const startCron = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily inactive lead check...');
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const inactiveLeads = await Lead.find({
        updatedAt: { $lt: twentyFourHoursAgo },
        status: { $nin: ['Booked', 'Lost'] }
      }).populate('assignedAgent');

      for (const lead of inactiveLeads) {
        if (!lead.followUpRequired) {
          lead.followUpRequired = true;
          await lead.save();

          await Activity.create({
            leadId: lead._id,
            action: 'Follow-up Required',
            note: 'System flagged for follow-up due to 24h inactivity.'
          });
          console.log(`Flagged: Lead ${lead.name} requires follow-up.`);
        }
      }
    } catch (err) {
      console.error('Error in cron job', err);
    }
  });
};

module.exports = startCron;
