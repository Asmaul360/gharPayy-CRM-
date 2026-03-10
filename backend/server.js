const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const startCron = require('./utils/cron');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./middleware/auth'), require('./routes/leadRoutes'));
app.use('/api/agents', require('./middleware/auth'), require('./routes/agentRoutes'));
app.use('/api/visits', require('./middleware/auth'), require('./routes/visitRoutes'));
app.use('/api/dashboard', require('./middleware/auth'), require('./routes/dashboardRoutes'));
app.use('/api/apartments', require('./middleware/auth'), require('./routes/apartmentRoutes'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gharpayy_crm', {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startCron();
    });
  })
  .catch(err => {
    console.error('MONGO CONNECTION ERROR:', err.message);
    process.exit(1);
  });
