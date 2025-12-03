import { useState, useEffect } from 'react';
import { JournalEntriesState, CreateJournalEntryRequest, AccountSummary } from '../types';
import { journalService } from '../services/journalService';

export const useJournalEntries = () => {
  const [state, setState] = useState<JournalEntriesState>({
    entries: [],
    currentEntry: {
      date: new Date(),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      description: '',
      movements: []
    },
    loading: false,
    error: null
  });

  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  const loadEntries = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const entries = await journalService.getEntries();
      setState(prev => ({ ...prev, entries, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
    }
  };

  const loadAccounts = async () => {
    setAccountsLoading(true);
    try {
      const accountsList = await journalService.getAccounts();
      setAccounts(accountsList);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setAccountsLoading(false);
    }
  };

  const createEntry = async (entryData: CreateJournalEntryRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newEntry = await journalService.createEntry(entryData);
      setState(prev => ({ 
        ...prev, 
        entries: [newEntry, ...prev.entries],
        loading: false,
        currentEntry: {
          date: new Date(),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          description: '',
          movements: []
        }
      }));
      return newEntry;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al crear asiento' 
      }));
      throw error;
    }
  };

  const updateCurrentEntry = (updates: Partial<CreateJournalEntryRequest>) => {
    setState(prev => ({
      ...prev,
      currentEntry: { ...prev.currentEntry, ...updates }
    }));
  };

  const resetCurrentEntry = () => {
    setState(prev => ({
      ...prev,
      currentEntry: {
        date: new Date(),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        description: '',
        movements: []
      }
    }));
  };

  useEffect(() => {
    loadEntries();
    loadAccounts();
  }, []);

  return {
    ...state,
    accounts,
    accountsLoading,
    createEntry,
    updateCurrentEntry,
    resetCurrentEntry,
    refetch: loadEntries
  };
};