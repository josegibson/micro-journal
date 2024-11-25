import { useState, useCallback } from 'react';
import { useApp } from '../providers/AppProvider';

const getApiBaseUrl = () => {
  const url = process.env.REACT_APP_BACKEND_URL;
  return url ? url : `http://localhost:5000`;
};

const API_BASE_URL = getApiBaseUrl();

export const useJournalSync = () => {
  const { user } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntries = useCallback(async (date) => {
    try {
      if (!user?.userId) {
        return [{ key: Date.now(), value: '' }];
      }

      const response = await fetch(`${API_BASE_URL}/journals/${date}`, {
        headers: { 'user-id': user.userId.toString() }
      });
      
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch entries');
    } catch (error) {
      setError(error.message);
      return [{ key: Date.now(), value: '' }];
    }
  }, [user]);

  const saveEntries = useCallback(async (date, entries) => {
    try {
      if (!user?.userId) {
        throw new Error('No user logged in');
      }

      setIsSyncing(true);
      const response = await fetch(`${API_BASE_URL}/journals/${date}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.userId.toString()
        },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) throw new Error('Failed to save entries');
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  const clearAllEntries = useCallback(async () => {
    try {
      if (!user?.userId) {
        throw new Error('No user logged in');
      }

      setIsSyncing(true);
      const response = await fetch(`${API_BASE_URL}/journals`, {
        method: 'DELETE',
        headers: {
          'user-id': user.userId.toString()
        }
      });

      if (!response.ok) throw new Error('Failed to clear entries');
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  return {
    isSyncing,
    error,
    fetchEntries,
    saveEntries,
    clearAllEntries
  };
}; 