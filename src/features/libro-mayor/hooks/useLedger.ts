import { useState, useEffect } from 'react';
import { LedgerState, LedgerFilters } from '../types';
import { ledgerService } from '../services/ledgerService';

export const useLedger = () => {
  const [state, setState] = useState<LedgerState>({
    accounts: [],
    currentReport: null,
    loading: false,
    error: null,
    filters: {
      accountId: '',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Primer día del mes actual
      endDate: new Date() // Fecha actual
    }
  });

  const loadAccounts = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const accounts = await ledgerService.getAccounts();
      setState(prev => ({ ...prev, accounts, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
    }
  };

  const generateReport = async (filters?: Partial<LedgerFilters>) => {
    const finalFilters = { ...state.filters, ...filters };
    
    if (!finalFilters.accountId) {
      setState(prev => ({ ...prev, error: 'Debe seleccionar una cuenta' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null, filters: finalFilters }));
    try {
      const report = await ledgerService.generateLedgerReport(finalFilters);
      setState(prev => ({ 
        ...prev, 
        currentReport: report, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al generar reporte' 
      }));
    }
  };

  const updateFilters = (updates: Partial<LedgerFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...updates }
    }));
  };

  const clearReport = () => {
    setState(prev => ({
      ...prev,
      currentReport: null,
      error: null
    }));
  };

  const exportToPDF = async () => {
    if (!state.currentReport) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      await ledgerService.exportToPDF(state.currentReport);
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
    if (!state.currentReport) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      await ledgerService.exportToExcel(state.currentReport);
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
    loadAccounts();
  }, []);

  return {
    ...state,
    generateReport,
    updateFilters,
    clearReport,
    exportToPDF,
    exportToExcel,
    refetch: loadAccounts
  };
};