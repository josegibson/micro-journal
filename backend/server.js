const express = require('express');
const cors = require('cors');
const app = express();

// In-memory database
const inMemoryDB = {
  users: new Map(),  // Store users: Map<userId, userObject>
  journals: new Map() // Store journals: Map<userId_date, journalObject>
};

let nextUserId = 1; // For auto-incrementing user IDs

app.use(cors());
app.use(express.json());

// Simple request logger middleware
const requestLogger = (req, res, next) => {
  const userId = req.headers['user-id'] || 'no-user';
  console.log(`[${req.method}] ${req.path} - User: ${userId}`);
  next();
};

app.use(requestLogger);

// User routes
app.post('/users', async (req, res) => {
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

// Journal routes
app.post('/journals/:date', async (req, res) => {
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

app.get('/journals/:date', async (req, res) => {
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

app.get('/journals', async (req, res) => {
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

app.delete('/journals', async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});