const express = require('express');
const router = express.Router();
const { inMemoryDB, nextUserId } = require('../models/db');

router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if user exists
    const existingUser = Array.from(inMemoryDB.users.values())
      .find(u => u.username === username);
    
    if (existingUser) {
      return res.json(existingUser);
    }

    // Create new user
    const user = {
      userId: nextUserId++,
      username,
      createdAt: new Date()
    };
    inMemoryDB.users.set(user.userId, user);
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 