import type { BalanceSheet, BalanceSheetAccount, BalanceSheetFilters, AccountType, AccountCategory } from '../types';
import { get } from '../../../shared/utils/service/api';

const URI_BASE = '/accounting';

// Mapear cuenta del backend al formato del frontend
interface BackendAccount {
  id: number;
  codigo: string;
  nombre: string;
  tipo_cuenta: string;
  saldo_deudor: number;
  saldo_acreedor: number;
}

const mapTipoToAccountType = (tipo: string): AccountType => {
  switch (tipo) {
    case '1': return 'Activo' as AccountType;
    case '2': return 'Pasivo' as AccountType;
    case '3': return 'Capital' as AccountType;
    case '4': return 'Ingreso' as AccountType;
    case '5': return 'Gasto' as AccountType;
    default: return 'Activo' as AccountType;
  }
};

const determineCategory = (account: BackendAccount): AccountCategory => {
  // Lógica simple para determinar categoría basada en código
  // Esto debería venir del backend idealmente
  const code = account.codigo;

  if (account.tipo_cuenta === '1') {
    // Activos corrientes típicamente 11xx
    if (code.startsWith('11') || code.startsWith('12')) {
      return 'Activo Corriente' as AccountCategory;
    }
    return 'Activo No Corriente' as AccountCategory;
  }

  if (account.tipo_cuenta === '2') {
    // Pasivos corrientes típicamente 21xx
    if (code.startsWith('21')) {
      return 'Pasivo Corriente' as AccountCategory;
    }
    return 'Pasivo No Corriente' as AccountCategory;
  }

  if (account.tipo_cuenta === '3') {
    if (code.startsWith('31')) {
      return 'Capital Social' as AccountCategory;
    }
    return 'Utilidades Retenidas' as AccountCategory;
  }

  return 'Activo Corriente' as AccountCategory;
};

class BalanceSheetService {
  async getAvailableDates(): Promise<Date[]> {
    // Generar fechas de ejemplo (últimos 12 meses)
    const dates: Date[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 0);
      dates.push(date);
    }

    return dates;
  }

  async generateBalanceSheet(filters: BalanceSheetFilters): Promise<BalanceSheet> {
    const response = await get<any>(`${URI_BASE}/balance-general`, {
      fecha_corte: filters.date.toISOString()
    });

    // Mapear cuentas del backend
    const mapAccount = (acc: BackendAccount): BalanceSheetAccount => ({
      id: acc.id.toString(),
      code: acc.codigo,
      name: acc.nombre,
      type: mapTipoToAccountType(acc.tipo_cuenta),
      category: determineCategory(acc),
      balance: Number(acc.saldo_deudor) - Number(acc.saldo_acreedor)
    });

    const assetAccounts = response.activos.map(mapAccount);
    const liabilityAccounts = response.pasivos.map(mapAccount);
    const equityAccounts = response.capital.map(mapAccount);

    // Agrupar por categoría
    const groupByCategory = (accounts: BalanceSheetAccount[]) => {
      const categories = new Map();

      accounts.forEach(account => {
        if (!categories.has(account.category)) {
          categories.set(account.category, {
            category: account.category,
            total: 0,
            accounts: []
          });
        }

        const categoryData = categories.get(account.category);
        categoryData.total += account.balance;
        categoryData.accounts.push(account);
      });

      return Array.from(categories.values());
    };

    // Convertir totales a números
    const totalActivos = Number(response.total_activos);
    const totalPasivos = Number(response.total_pasivos);
    const totalCapital = Number(response.total_capital);

    const balanceSheet: BalanceSheet = {
      id: `balance_${Date.now()}`,
      date: filters.date,
      title: `Balance General al ${filters.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      assets: {
        type: 'Activo' as AccountType,
        accounts: assetAccounts,
        total: totalActivos,
        categories: groupByCategory(assetAccounts)
      },
      liabilities: {
        type: 'Pasivo' as AccountType,
        accounts: liabilityAccounts,
        total: totalPasivos,
        categories: groupByCategory(liabilityAccounts)
      },
      equity: {
        type: 'Capital' as AccountType,
        accounts: equityAccounts,
        total: totalCapital,
        categories: groupByCategory(equityAccounts)
      },
      totalAssets: totalActivos,
      totalLiabilitiesAndEquity: totalPasivos + totalCapital,
      isBalanced: response.ecuacion_balanceada,
      generatedAt: new Date()
    };

    return balanceSheet;
  }

  async exportToPDF(balanceSheet: BalanceSheet): Promise<void> {
    console.log('Exportando Balance General a PDF:', balanceSheet);
    alert('Funcionalidad de exportación a PDF en desarrollo');
  }

  async exportToExcel(balanceSheet: BalanceSheet): Promise<void> {
    console.log('Exportando Balance General a Excel:', balanceSheet);
    alert('Funcionalidad de exportación a Excel en desarrollo');
  }
}

export const balanceSheetService = new BalanceSheetService();