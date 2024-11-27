import React, { useState } from 'react';
import { useApp } from '../providers/AppProvider';
import { FaTrash, FaCheck } from 'react-icons/fa';

function TodoList() {
  const { todos, addTodo, toggleTodo, removeTodo } = useApp();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  return (
    <div className="todo-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="todo-add-btn">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <button
              onClick={() => toggleTodo(todo.id, !todo.completed)}
              className="todo-check-btn"
            >
              <FaCheck />
            </button>
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="todo-delete-btn"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList; 