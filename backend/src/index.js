// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { client, isConnected } = require('./db');

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON request bodies

app.use(cors()); // Enable CORS


// Example health route for frontend to check DB status
app.get('/health', (req, res) => {
  if (isConnected()) {
    res.status(200).json({ db: 'connected' });
  } else {
    res.status(503).json({ db: 'unavailable' });
  }
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
