const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Journal = require('./models/Journal');
const User = require('./models/User');
const app = express();
const port = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    return User.findAll();
  })
  .then(users => {
    users.forEach(user => {
      console.log(`User ID: ${user.id}, Username: ${user.username}`);
    });
  })
  .catch(err => console.error('Database sync error:', err));

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} ${req.headers['user-id']}`);
  next();
});

// User routes
app.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if user exists
    let user = await User.findOne({ where: { username } });
    
    if (user) {
      return res.json({ userId: user.id, username: user.username });
    }

    // Create new user
    user = await User.create({ username });
    console.log(`Created new user: ${username}`);
    
    res.status(201).json({ userId: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Journal routes
app.get('/journals/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const userId = parseInt(req.headers['user-id'], 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    let journal = await Journal.findOne({ 
      where: { userId, date }
    });
    
    if (!journal) {
      journal = await Journal.create({
        userId,
        date,
        entries: [{ key: Date.now(), value: '' }]
      });
      console.log(`Created new entry for user ${userId} on date: ${date}`);
    }

    res.json(journal.entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/journals/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { entries } = req.body;
    const userId = parseInt(req.headers['user-id']);
    
    if (!entries) {
      return res.status(400).json({ error: 'Entries are required' });
    }

    const [journal, created] = await Journal.findOrCreate({
      where: { userId, date },
      defaults: { entries }
    });

    if (!created) {
      await journal.update({ entries });
    }

    res.status(200).json({ message: 'Entries saved', journal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/journals', async (req, res) => {
  try {
    const userId = parseInt(req.headers['user-id']);
    console.log(`Clearing all journal entries for user ${userId}`);
    await Journal.destroy({ where: { userId } });
    res.status(200).json({ message: 'All entries cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/journals', async (req, res) => {
  try {
    const userId = parseInt(req.headers['user-id']);
    const journals = await Journal.findAll({ where: { userId } });
    const journalsMap = {};
    journals.forEach(journal => {
      journalsMap[journal.date] = journal.entries;
    });
    res.json(journalsMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});