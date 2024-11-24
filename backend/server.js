const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let journals = {};

app.get('/journals/:date', (req, res) => {
  const { date } = req.params;
  res.json(journals[date] || []);
});

app.post('/journals/:date', (req, res) => {
  const { date } = req.params;
  const { entries } = req.body;
  journals[date] = entries;
  res.status(200).send('Entries saved');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});