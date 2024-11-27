import React, { useState } from 'react';
import { useApp } from '../providers/AppProvider';
import { FaPlus, FaTimes, FaCheck } from 'react-icons/fa';

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
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button 
          type="submit" 
          className={`todo-add-btn ${newTodo.trim() ? 'active' : ''}`}
          aria-label="Add task"
        >
          <FaPlus />
        </button>
      </form>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="todo-empty">No tasks yet. Add one above!</li>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <div className="todo-item-left">
                <button
                  onClick={() => toggleTodo(todo.id, !todo.completed)}
                  className="todo-check-btn"
                >
                  <FaCheck />
                </button>
                <span className="todo-text">{todo.text}</span>
              </div>
              <button
                onClick={() => removeTodo(todo.id)}
                className="todo-delete-btn"
                aria-label="Delete todo"
              >
                <FaTimes />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoList; 