const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Mock data
const users = [
  {
    id: 1,
    name: 'Darvin Patel',
    email: 'darvin.patel@example.com'
  },
  {
    id: 2,
    name: 'Seemons Patel',
    email: 'seemons.patel@example.com'
  }
];

// Routes
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).send();
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.json(user);
});

app.get('/users', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(users);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`User Provider server running on port ${port}`);
  });
}

module.exports = app;