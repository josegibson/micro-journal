const express = require('express');
const router = express.Router();
const { inMemoryDB } = require('../models/db');

router.post('/:date', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { date } = req.params;
    const { entries } = req.body;
    
    if (!userId || !date || !entries) {
      return res.status(400).json({ error: 'UserId, date, and entries are required' });
    }

    const journalKey = `${userId}_${date}`;
    const journal = {
      id: journalKey,
      userId,
      date,
      entries,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    inMemoryDB.journals.set(journalKey, journal);
    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:date', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { date } = req.params;
    const journalKey = `${userId}_${date}`;
    
    const journal = inMemoryDB.journals.get(journalKey);
    
    if (!journal) {
      return res.json([{ key: Date.now(), value: '' }]);
    }
    
    res.json(journal.entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    const userJournals = {};
    for (const [key, journal] of inMemoryDB.journals.entries()) {
      if (journal.userId === userId) {
        userJournals[journal.date] = journal.entries;
      }
    }
    
    res.json(userJournals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    for (const [key, journal] of inMemoryDB.journals.entries()) {
      if (journal.userId === userId) {
        inMemoryDB.journals.delete(key);
      }
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 