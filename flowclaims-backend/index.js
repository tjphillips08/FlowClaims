// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically (if needed later)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Placeholder route
app.get('/', (req, res) => {
  res.send('FlowClaims backend is running.');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
