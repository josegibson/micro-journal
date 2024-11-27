const express = require('express');
const router = express.Router();
const { inMemoryDB } = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    const userTodos = inMemoryDB.todos.get(userId) || [];
    res.json(userTodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { text } = req.body;
    
    if (!userId || !text) {
      return res.status(400).json({ error: 'UserId and text are required' });
    }

    const todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date()
    };

    const userTodos = inMemoryDB.todos.get(userId) || [];
    userTodos.push(todo);
    inMemoryDB.todos.set(userId, userTodos);
    
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const todoId = parseInt(req.params.id);
    const { completed } = req.body;
    
    const userTodos = inMemoryDB.todos.get(userId) || [];
    const todoIndex = userTodos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    userTodos[todoIndex].completed = completed;
    inMemoryDB.todos.set(userId, userTodos);
    
    res.json(userTodos[todoIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const todoId = parseInt(req.params.id);
    
    const userTodos = inMemoryDB.todos.get(userId) || [];
    const filteredTodos = userTodos.filter(todo => todo.id !== todoId);
    
    inMemoryDB.todos.set(userId, filteredTodos);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 