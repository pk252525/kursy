const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import tras
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Użycie tras
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend działa na http://localhost:${PORT}`);
});
