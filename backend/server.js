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

// Routes
app.use('/users', userRoutes);
app.use('/journals', journalRoutes);
app.use('/todos', todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});