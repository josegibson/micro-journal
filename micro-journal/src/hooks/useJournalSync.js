import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000';

export const useJournalSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch entries for a specific date from the backend
  const fetchEntries = useCallback(async (date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/journals/${date}`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, []);

  // Save entries to the backend
  const saveEntries = useCallback(async (date, entries) => {
    if (!isOnline) return false;

    try {
      setIsSyncing(true);
      const response = await fetch(`${API_BASE_URL}/journals/${date}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) throw new Error('Failed to save entries');
      const data = await response.json();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  // Clear all entries from the backend
  const clearAllEntries = useCallback(async () => {
    if (!isOnline) return false;

    try {
      setIsSyncing(true);
      const response = await fetch(`${API_BASE_URL}/journals`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to clear entries');
      const data = await response.json();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  // Fetch all entries from the backend
  const fetchAllEntries = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/journals`);
      if (!response.ok) throw new Error('Failed to fetch all entries');
      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, []);

  return {
    isOnline,
    isSyncing,
    error,
    fetchEntries,
    saveEntries,
    clearAllEntries,
    fetchAllEntries,
  };
}; 