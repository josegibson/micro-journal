const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const userRoutes = require('./routes/users');
const journalRoutes = require('./routes/journals');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check route
app.get('/', (req, res) => {
  console.log('Health check request received');
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/users', userRoutes);
app.use('/journals', journalRoutes);
app.use('/todos', todoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server started successfully`);
  console.log(`📡 Running on port: ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log('=================================');
});