const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

let journals = {};

app.get('/journals/:date', (req, res) => {
  const { date } = req.params;
  
  if (!journals[date]) {
    journals[date] = [{ key: Date.now(), value: '' }];
    console.log(`Created new entry for date: ${date}`);
  }

  res.json(journals[date]);
});

app.post('/journals/:date', (req, res) => {
  const { date } = req.params;
  const { entries } = req.body;
  
  if (!entries) {
    return res.status(400).json({ error: 'Entries are required' });
  }

  journals[date] = entries;
  res.status(200).json({ message: 'Entries saved' });
});

app.delete('/journals', (req, res) => {
  console.log('Clearing all journal entries');
  journals = {};
  res.status(200).json({ message: 'All entries cleared' });
});

app.get('/journals', (req, res) => {
  res.json(journals);
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});