import type { LedgerAccount, LedgerMovement, LedgerReport, LedgerFilters, AccountType } from '../types';
import { get, post } from '../../../shared/utils/service/api';

const URI_BASE = '/accounting';

// Mapear cuenta del backend al formato del frontend
interface BackendAccount {
  id: number;
  codigo: string;
  nombre: string;
  tipo_cuenta: string;
  saldo_deudor: number;
  saldo_acreedor: number;
  es_detalle: boolean;
  activa: boolean;
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

const mapBackendAccountToLedger = (account: BackendAccount): LedgerAccount => {
  const balance = account.saldo_deudor - account.saldo_acreedor;
  const nature = ['1', '5'].includes(account.tipo_cuenta) ? 'Deudora' : 'Acreedora';

  return {
    id: account.id.toString(),
    code: account.codigo,
    name: account.nombre,
    type: mapTipoToAccountType(account.tipo_cuenta),
    nature,
    initialBalance: balance
  };
};

class LedgerService {
  async getAccounts(): Promise<LedgerAccount[]> {
    // Obtener solo cuentas de detalle para libro mayor
    const accounts = await get<BackendAccount[]>(`${URI_BASE}/cuentas-detalle?activa=true`);
    return accounts.map(mapBackendAccountToLedger);
  }

  async generateLedgerReport(filters: LedgerFilters): Promise<LedgerReport> {
    const payload = {
      cuenta_id: parseInt(filters.accountId),
      fecha_inicio: filters.startDate.toISOString(),
      fecha_fin: filters.endDate.toISOString()
    };

    const response = await post<any, typeof payload>(`${URI_BASE}/libro-mayor`, payload);

    // Mapear la respuesta del backend al formato del frontend
    const account: LedgerAccount = {
      id: response.cuenta.id.toString(),
      code: response.cuenta.codigo,
      name: response.cuenta.nombre,
      type: mapTipoToAccountType(response.cuenta.tipo_cuenta),
      nature: ['1', '5'].includes(response.cuenta.tipo_cuenta) ? 'Deudora' : 'Acreedora',
      initialBalance: response.saldo_inicial
    };

    const movements: LedgerMovement[] = response.movimientos.map((mov: any) => ({
      id: mov.id?.toString() || `${Date.now()}-${Math.random()}`,
      date: new Date(mov.fecha),
      description: mov.descripcion,
      reference: mov.referencia || 'N/A',
      debit: Number(mov.debito) || 0,
      credit: Number(mov.credito) || 0,
      balance: Number(mov.saldo)
    }));

    // Calcular totales de forma segura
    const totalDebits = movements.reduce((sum, mov) => sum + (mov.debit || 0), 0);
    const totalCredits = movements.reduce((sum, mov) => sum + (mov.credit || 0), 0);

    return {
      account,
      movements,
      totalDebits,
      totalCredits,
      finalBalance: Number(response.saldo_final),
      period: {
        startDate: filters.startDate,
        endDate: filters.endDate
      }
    };
  }

  async exportToPDF(report: LedgerReport): Promise<void> {
    // TODO: Implementar exportación a PDF cuando el backend lo soporte
    console.log('Exportando a PDF:', report);
    alert('Funcionalidad de exportación a PDF en desarrollo');
  }

  async exportToExcel(report: LedgerReport): Promise<void> {
    // TODO: Implementar exportación a Excel cuando el backend lo soporte
    console.log('Exportando a Excel:', report);
    alert('Funcionalidad de exportación a Excel en desarrollo');
  }
}

export const ledgerService = new LedgerService();