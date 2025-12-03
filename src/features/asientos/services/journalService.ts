import type { JournalEntry, CreateJournalEntryRequest, AccountSummary } from '../types';
import { get, post, del } from '../../../shared/utils/service/api';

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

interface BackendMovimiento {
  id: number;
  cuenta_debito_id?: number;
  cuenta_credito_id?: number;
  monto: number;
  descripcion?: string;
}

interface BackendPartida {
  id: number;
  numero_partida: number;
  fecha: string;
  descripcion: string;
  total_debito: number;
  total_credito: number;
  balanceada: boolean;
  movimientos: BackendMovimiento[];
  created_at: string;
}

const mapBackendAccountToSummary = (account: BackendAccount): AccountSummary => {
  const balance = account.saldo_deudor - account.saldo_acreedor;
  const nature = ['1', '5'].includes(account.tipo_cuenta) ? 'Deudora' : 'Acreedora';

  return {
    id: account.id.toString(),
    code: account.codigo,
    name: account.nombre,
    balance: Math.abs(balance),
    nature
  };
};

const mapBackendPartidaToJournalEntry = (partida: BackendPartida, accounts: BackendAccount[]): JournalEntry => {
  const movements = partida.movimientos.map(mov => {
    const accountId = mov.cuenta_debito_id || mov.cuenta_credito_id;
    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }

    return {
      id: mov.id.toString(),
      accountId: account.id.toString(),
      accountCode: account.codigo,
      accountName: account.nombre,
      accountBalance: account.saldo_deudor - account.saldo_acreedor,
      accountNature: ['1', '5'].includes(account.tipo_cuenta) ? 'Deudora' as const : 'Acreedora' as const,
      debit: mov.cuenta_debito_id ? mov.monto : 0,
      credit: mov.cuenta_credito_id ? mov.monto : 0
    };
  });

  const date = new Date(partida.fecha);

  return {
    id: partida.id.toString(),
    date: date,
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    description: partida.descripcion,
    movements,
    totalDebits: partida.total_debito,
    totalCredits: partida.total_credito,
    isBalanced: partida.balanceada,
    createdAt: new Date(partida.created_at),
    updatedAt: new Date(partida.created_at)
  };
};

class JournalService {
  private accountsCache: BackendAccount[] | null = null;

  async getAccounts(): Promise<AccountSummary[]> {
    // Obtener solo cuentas de detalle para asientos
    const accounts = await get<BackendAccount[]>(`${URI_BASE}/cuentas-detalle?activa=true`);
    this.accountsCache = accounts;
    return accounts.map(mapBackendAccountToSummary);
  }

  async getEntries(): Promise<JournalEntry[]> {
    const partidas = await get<BackendPartida[]>(`${URI_BASE}/partidas`);

    // Asegurar que tenemos las cuentas cargadas
    if (!this.accountsCache) {
      await this.getAccounts();
    }

    return partidas.map(partida => mapBackendPartidaToJournalEntry(partida, this.accountsCache!));
  }

  async createEntry(entryData: CreateJournalEntryRequest): Promise<JournalEntry> {
    // Validar que esté balanceado
    const totalDebits = entryData.movements.reduce((sum, mov) => sum + mov.debit, 0);
    const totalCredits = entryData.movements.reduce((sum, mov) => sum + mov.credit, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new Error('La partida no está balanceada. Los débitos deben ser iguales a los créditos.');
    }

    // Mapear movimientos al formato del backend
    const movimientos = entryData.movements.map(mov => ({
      cuenta_debito_id: mov.debit > 0 ? parseInt(mov.accountId) : undefined,
      cuenta_credito_id: mov.credit > 0 ? parseInt(mov.accountId) : undefined,
      monto: mov.debit > 0 ? mov.debit : mov.credit,
      descripcion: entryData.description
    }));

    const payload = {
      fecha: entryData.date.toISOString(),
      descripcion: entryData.description,
      movimientos
    };

    const createdPartida = await post<BackendPartida, typeof payload>(`${URI_BASE}/partidas`, payload);

    // Asegurar que tenemos las cuentas cargadas
    if (!this.accountsCache) {
      await this.getAccounts();
    }

    return mapBackendPartidaToJournalEntry(createdPartida, this.accountsCache!);
  }

  async deleteEntry(id: string): Promise<void> {
    await del<void>(`${URI_BASE}/partidas/${id}`);
  }
}

export const journalService = new JournalService();