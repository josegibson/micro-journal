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