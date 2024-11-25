import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../providers/UserProvider';

const getApiBaseUrl = () => {
  const url = process.env.REACT_APP_BACKEND_URL;
  return url ? url : `http://localhost:5000`;
};

const API_BASE_URL = getApiBaseUrl();
const STORAGE_KEY = 'journal_entries';

export const useJournalSync = () => {
  const { userId } = useUser();
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
      // Return empty entry if no user
      if (!userId) {
        return [{ key: Date.now(), value: '' }];
      }

      const localEntries = loadFromStorage()[date];
      if (isOnline) {
        const response = await fetch(`${API_BASE_URL}/journals/${date}`, {
          headers: { 'user-id': userId.toString() }
        });
        if (response.ok) {
          const serverEntries = await response.json();
          saveToStorage({ ...loadFromStorage(), [date]: serverEntries });
          return serverEntries;
        }
      }
      return localEntries || [{ key: Date.now(), value: '' }];
    } catch (error) {
      setError(error.message);
      return loadFromStorage()[date] || [{ key: Date.now(), value: '' }];
    }
  }, [isOnline, loadFromStorage, saveToStorage, userId]);

  // Save entries
  const saveEntries = useCallback(async (date, entries) => {
    try {
      if (!userId) {
        throw new Error('No user logged in');
      }
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
            'user-id': userId.toString()
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
  }, [isOnline, loadFromStorage, saveToStorage, userId]);

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
          headers: {
            'user-id': userId.toString()
          }
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
  }, [isOnline, userId]);

  // Fetch all entries
  const fetchAllEntries = useCallback(async () => {
    try {
      // If online, fetch from backend and update localStorage
      if (isOnline) {
        const response = await fetch(`${API_BASE_URL}/journals`, {
          headers: {
            'user-id': userId.toString()
          }
        });
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
  }, [isOnline, saveToStorage, loadFromStorage, userId]);

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