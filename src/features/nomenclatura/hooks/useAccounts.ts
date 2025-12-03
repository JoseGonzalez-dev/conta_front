import { useState, useEffect } from 'react';
import { Account, AccountsState, CreateAccountRequest } from '../types';
import { accountsService } from '../services/accountsService';

export const useAccounts = () => {
  const [state, setState] = useState<AccountsState>({
    accounts: [],
    loading: false,
    error: null,
    searchTerm: ''
  });

  const loadAccounts = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const accounts = await accountsService.getAll();
      setState(prev => ({ ...prev, accounts, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
    }
  };

  const createAccount = async (accountData: CreateAccountRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newAccount = await accountsService.create(accountData);
      setState(prev => ({ 
        ...prev, 
        accounts: [...prev.accounts, newAccount],
        loading: false 
      }));
      return newAccount;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al crear cuenta' 
      }));
      throw error;
    }
  };

  const updateSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  };

  const filteredAccounts = state.accounts.filter(account =>
    account.code.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    account.name.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadAccounts();
  }, []);

  return {
    ...state,
    filteredAccounts,
    createAccount,
    updateSearchTerm,
    refetch: loadAccounts
  };
};