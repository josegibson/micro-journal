import React from 'react';
import TodoList from '../components/TodoList';
import { Navigate } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';

function Todos() {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page">
      <h1 className="heading">Todo List</h1>
      <TodoList />
    </div>
  );
}

export default Todos; 