export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  nature: 'Deudora' | 'Acreedora';
  initialBalance: number;
}

export interface LedgerMovement {
  id: string;
  date: Date;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface LedgerReport {
  account: LedgerAccount;
  movements: LedgerMovement[];
  totalDebits: number;
  totalCredits: number;
  finalBalance: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface LedgerFilters {
  accountId: string;
  startDate: Date;
  endDate: Date;
}

export interface LedgerState {
  accounts: LedgerAccount[];
  currentReport: LedgerReport | null;
  loading: boolean;
  error: string | null;
  filters: LedgerFilters;
}

export enum AccountType {
  ACTIVO = 'Activo',
  PASIVO = 'Pasivo',
  CAPITAL = 'Capital',
  INGRESO = 'Ingreso',
  GASTO = 'Gasto'
}