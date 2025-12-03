import { useState, useEffect } from 'react';
import { BalanceSheetState, BalanceSheetFilters } from '../types';
import { balanceSheetService } from '../services/balanceSheetService';

export const useBalanceSheet = () => {
  const [state, setState] = useState<BalanceSheetState>({
    currentBalance: null,
    availableDates: [],
    filters: {
      date: new Date(),
      includeZeroBalances: false,
      groupByCategory: true
    },
    loading: false,
    error: null
  });

  const loadAvailableDates = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const dates = await balanceSheetService.getAvailableDates();
      setState(prev => ({ 
        ...prev, 
        availableDates: dates, 
        loading: false,
        filters: {
          ...prev.filters,
          date: dates[0] || new Date()
        }
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
    }
  };

  const generateBalanceSheet = async (filters?: Partial<BalanceSheetFilters>) => {
    const finalFilters = { ...state.filters, ...filters };
    
    setState(prev => ({ ...prev, loading: true, error: null, filters: finalFilters }));
    try {
      const balanceSheet = await balanceSheetService.generateBalanceSheet(finalFilters);
      setState(prev => ({ 
        ...prev, 
        currentBalance: balanceSheet, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al generar balance' 
      }));
    }
  };

  const updateFilters = (updates: Partial<BalanceSheetFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...updates }
    }));
  };

  const clearBalance = () => {
    setState(prev => ({
      ...prev,
      currentBalance: null,
      error: null
    }));
  };

  const exportToPDF = async () => {
    if (!state.currentBalance) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      await balanceSheetService.exportToPDF(state.currentBalance);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error al exportar PDF' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const exportToExcel = async () => {
    if (!state.currentBalance) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      await balanceSheetService.exportToExcel(state.currentBalance);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error al exportar Excel' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadAvailableDates();
  }, []);

  return {
    ...state,
    generateBalanceSheet,
    updateFilters,
    clearBalance,
    exportToPDF,
    exportToExcel,
    refetch: loadAvailableDates
  };
};