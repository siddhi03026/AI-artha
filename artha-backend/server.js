const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const onboardingRoutes = require('./routes/onboardingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const personalityRoutes = require('./routes/personalityRoutes');
const aiPlanRoutes = require('./routes/aiPlanRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/onboarding', onboardingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/personality', personalityRoutes);
app.use('/api/ai-plan', aiPlanRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Artha AI server running on port ${PORT}`);
});
