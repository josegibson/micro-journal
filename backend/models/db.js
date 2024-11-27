// In-memory database
const inMemoryDB = {
  users: new Map(),  // Store users: Map<userId, userObject>
  journals: new Map(), // Store journals: Map<userId_date, journalObject>
  todos: new Map(), // Store todos: Map<userId, todoArray>
  nextUserId: 1 // Move nextUserId into the inMemoryDB object
};

module.exports = {
  inMemoryDB
}; 