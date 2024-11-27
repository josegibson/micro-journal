const express = require('express');
const router = express.Router();
const { inMemoryDB } = require('../models/db');

router.post('/', async (req, res) => {
  console.log('Received request body:', req.body);
  
  try {
    const { username } = req.body;
    console.log('Username:', username);
    
    if (!username) {
      console.log('Username missing');
      return res.status(400).json({ error: 'Username is required' });
    }

    console.log('Current inMemoryDB state:', {
      usersSize: inMemoryDB.users.size,
      nextUserId: inMemoryDB.nextUserId
    });

    // Check if user exists
    const existingUser = Array.from(inMemoryDB.users.values())
      .find(u => u.username === username);
    
    if (existingUser) {
      console.log('Found existing user:', existingUser);
      return res.json(existingUser);
    }

    // Create new user
    const user = {
      userId: inMemoryDB.nextUserId,
      username,
      createdAt: new Date()
    };
    
    console.log('Creating new user:', user);
    inMemoryDB.users.set(user.userId, user);
    inMemoryDB.nextUserId++; // Increment after using
    
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error in users route:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

module.exports = router; 