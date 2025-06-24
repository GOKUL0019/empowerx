const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const users = []; // In-memory store

app.post('/api/social-login', (req, res) => {
  const { name, email, provider } = req.body;

  if (!email || !provider) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  let user = users.find(u => u.email === email);
  if (!user) {
    // Assign default role
    user = { name, email, provider, role: 'learner' };
    users.push(user);
  }

  return res.status(200).json({ message: 'Login successful', name: user.name, role: user.role });
});
