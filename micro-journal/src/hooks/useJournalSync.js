import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const STORAGE_KEY = 'journal_entries';

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

  // Load entries from localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return {};
    }
  }, []);

  // Save entries to localStorage
  const saveToStorage = useCallback((entries) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, []);

  // Fetch entries for a specific date
  const fetchEntries = useCallback(async (date) => {
    try {
      // First check localStorage
      const localEntries = loadFromStorage()[date];
      
      // If online, try to fetch from backend
      if (isOnline) {
        const response = await fetch(`${API_BASE_URL}/journals/${date}`);
        if (response.ok) {
          const serverEntries = await response.json();
          // Update localStorage with server data
          const allEntries = loadFromStorage();
          allEntries[date] = serverEntries;
          saveToStorage(allEntries);
          return serverEntries;
        }
      }
      
      // Return local entries if they exist, or default empty entry
      return localEntries || [{ key: Date.now(), value: '' }];
    } catch (error) {
      setError(error.message);
      // Fallback to localStorage on error
      return loadFromStorage()[date] || [{ key: Date.now(), value: '' }];
    }
  }, [isOnline, loadFromStorage, saveToStorage]);

  // Save entries
  const saveEntries = useCallback(async (date, entries) => {
    try {
      // Always save to localStorage first
      const allEntries = loadFromStorage();
      allEntries[date] = entries;
      saveToStorage(allEntries);

      // If online, sync with backend
      if (isOnline) {
        setIsSyncing(true);
        const response = await fetch(`${API_BASE_URL}/journals/${date}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ entries }),
        });

        if (!response.ok) throw new Error('Failed to save entries');
      }
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, loadFromStorage, saveToStorage]);

  // Clear all entries
  const clearAllEntries = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);

      // If online, clear backend
      if (isOnline) {
        setIsSyncing(true);
        const response = await fetch(`${API_BASE_URL}/journals`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to clear entries');
      }
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  // Fetch all entries
  const fetchAllEntries = useCallback(async () => {
    try {
      // If online, fetch from backend and update localStorage
      if (isOnline) {
        const response = await fetch(`${API_BASE_URL}/journals`);
        if (response.ok) {
          const serverEntries = await response.json();
          saveToStorage(serverEntries);
          return serverEntries;
        }
      }
      
      // Fallback to localStorage
      return loadFromStorage();
    } catch (error) {
      setError(error.message);
      return loadFromStorage();
    }
  }, [isOnline, saveToStorage, loadFromStorage]);

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