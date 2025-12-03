import type { ClosingPeriod, IncomeStatement, ResultAccount, ClosingProcess, ClosingEntry } from '../types';
import { get, post } from '../../../shared/utils/service/api';

const URI_BASE = '/accounting';

class ClosingService {
  async getAvailablePeriods(): Promise<ClosingPeriod[]> {
    const periodos = await get<any[]>(`${URI_BASE}/periodos-contables?activo=true`);

    return periodos.map(p => ({
      id: p.id.toString(),
      year: new Date(p.fecha_inicio).getFullYear(),
      month: new Date(p.fecha_inicio).getMonth() + 1,
      name: p.nombre,
      status: p.estado === 'cerrado' ? 'closed' as const : 'open' as const,
      startDate: new Date(p.fecha_inicio),
      endDate: new Date(p.fecha_fin),
      closedAt: p.fecha_cierre ? new Date(p.fecha_cierre) : undefined,
      closedBy: p.cerrado_por ? 'Usuario' : undefined
    }));
  }

  async getIncomeStatement(periodId: string): Promise<IncomeStatement> {
    // Obtener el período para las fechas
    const periodos = await this.getAvailablePeriods();
    const period = periodos.find(p => p.id === periodId);

    if (!period) {
      throw new Error('Período no encontrado');
    }

    const response = await get<any>(`${URI_BASE}/estado-resultados`, {
      fecha_inicio: period.startDate.toISOString(),
      fecha_fin: period.endDate.toISOString()
    });

    // Mapear cuentas de ingresos
    const incomeAccounts: ResultAccount[] = response.ingresos.map((cuenta: any) => ({
      id: cuenta.id.toString(),
      code: cuenta.codigo,
      name: cuenta.nombre,
      type: 'income' as const,
      balance: cuenta.saldo_acreedor - cuenta.saldo_deudor,
      movements: [] // El backend no devuelve movimientos detallados en este endpoint
    }));

    // Mapear cuentas de gastos
    const expenseAccounts: ResultAccount[] = response.gastos.map((cuenta: any) => ({
      id: cuenta.id.toString(),
      code: cuenta.codigo,
      name: cuenta.nombre,
      type: 'expense' as const,
      balance: cuenta.saldo_deudor - cuenta.saldo_acreedor,
      movements: [] // El backend no devuelve movimientos detallados en este endpoint
    }));

    return {
      totalIncome: response.total_ingresos,
      totalExpenses: response.total_gastos,
      netIncome: response.utilidad_neta,
      incomeAccounts,
      expenseAccounts
    };
  }

  async processClosing(periodId: string): Promise<ClosingProcess> {
    const periodos = await this.getAvailablePeriods();
    const period = periodos.find(p => p.id === periodId);

    if (!period) {
      throw new Error('Período no encontrado');
    }

    const incomeStatement = await this.getIncomeStatement(periodId);

    // Generar asientos de cierre simulados
    const closingEntries: ClosingEntry[] = [];

    // 1. Asiento de cierre de ingresos
    if (incomeStatement.totalIncome > 0) {
      closingEntries.push({
        id: `closing_income_${Date.now()}`,
        date: period.endDate,
        description: `Cierre de cuentas de ingresos - ${period.name}`,
        type: 'income_closing',
        movements: [
          ...incomeStatement.incomeAccounts.map(acc => ({
            accountId: acc.id,
            accountCode: acc.code,
            accountName: acc.name,
            debit: acc.balance,
            credit: 0
          })),
          {
            accountId: 'result_summary',
            accountCode: '3999',
            accountName: 'Resumen de Resultados',
            debit: 0,
            credit: incomeStatement.totalIncome
          }
        ]
      });
    }

    // 2. Asiento de cierre de gastos
    if (incomeStatement.totalExpenses > 0) {
      closingEntries.push({
        id: `closing_expense_${Date.now()}`,
        date: period.endDate,
        description: `Cierre de cuentas de gastos - ${period.name}`,
        type: 'expense_closing',
        movements: [
          {
            accountId: 'result_summary',
            accountCode: '3999',
            accountName: 'Resumen de Resultados',
            debit: incomeStatement.totalExpenses,
            credit: 0
          },
          ...incomeStatement.expenseAccounts.map(acc => ({
            accountId: acc.id,
            accountCode: acc.code,
            accountName: acc.name,
            debit: 0,
            credit: acc.balance
          }))
        ]
      });
    }

    // 3. Asiento de transferencia del resultado
    if (incomeStatement.netIncome !== 0) {
      closingEntries.push({
        id: `result_transfer_${Date.now()}`,
        date: period.endDate,
        description: `Transferencia del resultado del ejercicio - ${period.name}`,
        type: 'result_transfer',
        movements: [
          {
            accountId: 'result_summary',
            accountCode: '3999',
            accountName: 'Resumen de Resultados',
            debit: incomeStatement.netIncome > 0 ? incomeStatement.netIncome : 0,
            credit: incomeStatement.netIncome < 0 ? Math.abs(incomeStatement.netIncome) : 0
          },
          {
            accountId: 'retained_earnings',
            accountCode: '3105',
            accountName: 'Utilidades Retenidas',
            debit: incomeStatement.netIncome < 0 ? Math.abs(incomeStatement.netIncome) : 0,
            credit: incomeStatement.netIncome > 0 ? incomeStatement.netIncome : 0
          }
        ]
      });
    }

    return {
      period,
      incomeStatement,
      closingEntries,
      currentStep: 1,
      totalSteps: 2,
      isComplete: false
    };
  }

  async executeClosing(periodId: string): Promise<void> {
    // Obtener el período para las fechas
    const periodos = await this.getAvailablePeriods();
    const period = periodos.find(p => p.id === periodId);

    if (!period) {
      throw new Error('Período no encontrado');
    }

    const payload = {
      fecha_cierre: period.endDate.toISOString(),
      descripcion: `Cierre del ejercicio contable - ${period.name}`
    };

    await post<any, typeof payload>(`${URI_BASE}/cierre-contable`, payload);
  }

  async executeOpening(filters: { startDate: Date; periodName?: string }): Promise<void> {
    const payload = {
      fecha_apertura: filters.startDate.toISOString(),
      periodo_anterior_id: null, // Opcional, se puede agregar si se quiere referenciar al anterior
      descripcion: filters.periodName
        ? `Apertura del ejercicio contable - ${filters.periodName}`
        : 'Apertura del nuevo ejercicio contable'
    };

    await post<any, typeof payload>(`${URI_BASE}/apertura-contable`, payload);
  }
}

export const closingService = new ClosingService();