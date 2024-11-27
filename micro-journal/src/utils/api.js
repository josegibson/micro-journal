export const saveEntriesToBackend = async (API_BASE_URL, userId, date, entries) => {
  try {
    const response = await fetch(`${API_BASE_URL}/journals/${date}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId.toString()
      },
      body: JSON.stringify({ entries }),
    });

    if (!response.ok) throw new Error('Failed to save entries');
  } catch (error) {
    console.error('Failed to sync entries:', error);
  }
};

export const fetchEntriesFromBackend = async (API_BASE_URL, userId, date) => {
  try {
    const response = await fetch(`${API_BASE_URL}/journals/${date}`, {
      headers: { 'user-id': userId.toString() }
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch entries');
    }
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    return null;
  }
};

export const clearEntriesFromBackend = async (API_BASE_URL, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/journals`, {
      method: 'DELETE',
      headers: {
        'user-id': userId.toString()
      }
    });

    if (!response.ok) throw new Error('Failed to clear entries');
  } catch (error) {
    console.error('Failed to clear remote data:', error);
  }
};

export const fetchTodos = async (API_BASE_URL, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      headers: { 'user-id': userId.toString() }
    });

    if (!response.ok) throw new Error('Failed to fetch todos');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return [];
  }
};

export const createTodo = async (API_BASE_URL, userId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId.toString()
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error('Failed to create todo');
    return await response.json();
  } catch (error) {
    console.error('Failed to create todo:', error);
    return null;
  }
};

export const updateTodo = async (API_BASE_URL, userId, todoId, completed) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId.toString()
      },
      body: JSON.stringify({ completed })
    });

    if (!response.ok) throw new Error('Failed to update todo');
    return await response.json();
  } catch (error) {
    console.error('Failed to update todo:', error);
    return null;
  }
};

export const deleteTodo = async (API_BASE_URL, userId, todoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
      method: 'DELETE',
      headers: { 'user-id': userId.toString() }
    });

    if (!response.ok) throw new Error('Failed to delete todo');
    return true;
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return false;
  }
}; 