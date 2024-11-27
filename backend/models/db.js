// In-memory database
const inMemoryDB = {
  users: new Map(),  // Store users: Map<userId, userObject>
  journals: new Map(), // Store journals: Map<userId_date, journalObject>
  todos: new Map() // Store todos: Map<userId, todoArray>
};

let nextUserId = 1; // For auto-incrementing user IDs

module.exports = {
  inMemoryDB,
  nextUserId,
}; 