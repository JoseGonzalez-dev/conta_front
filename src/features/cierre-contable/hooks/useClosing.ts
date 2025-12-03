import { useState, useEffect } from 'react';
import { ClosingState } from '../types';
import { closingService } from '../services/closingService';

export const useClosing = () => {
  const [state, setState] = useState<ClosingState>({
    availablePeriods: [],
    selectedPeriod: null,
    closingProcess: null,
    loading: false,
    error: null
  });

  const loadPeriods = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const periods = await closingService.getAvailablePeriods();
      setState(prev => ({ ...prev, availablePeriods: periods, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
    }
  };

  const selectPeriod = (periodId: string) => {
    const period = state.availablePeriods.find(p => p.id === periodId);
    setState(prev => ({
      ...prev,
      selectedPeriod: period || null,
      closingProcess: null,
      error: null
    }));
  };

  const calculateResults = async () => {
    if (!state.selectedPeriod) {
      setState(prev => ({ ...prev, error: 'Debe seleccionar un período' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const closingProcess = await closingService.processClosing(state.selectedPeriod.id);
      setState(prev => ({ 
        ...prev, 
        closingProcess, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al calcular resultados' 
      }));
    }
  };

  const executeClosing = async () => {
    if (!state.selectedPeriod || !state.closingProcess) {
      setState(prev => ({ ...prev, error: 'No hay proceso de cierre iniciado' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await closingService.executeClosing(state.selectedPeriod.id);
      
      // Actualizar el estado del período
      setState(prev => ({
        ...prev,
        selectedPeriod: prev.selectedPeriod ? {
          ...prev.selectedPeriod,
          status: 'closed',
          closedAt: new Date(),
          closedBy: 'Administrador'
        } : null,
        closingProcess: prev.closingProcess ? {
          ...prev.closingProcess,
          currentStep: 2,
          isComplete: true
        } : null,
        loading: false
      }));

      // Recargar períodos para reflejar el cambio
      await loadPeriods();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al ejecutar cierre' 
      }));
    }
  };

  const resetProcess = () => {
    setState(prev => ({
      ...prev,
      selectedPeriod: null,
      closingProcess: null,
      error: null
    }));
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  return {
    ...state,
    selectPeriod,
    calculateResults,
    executeClosing,
    resetProcess,
    refetch: loadPeriods
  };
};