export interface BalanceSheetAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  balance: number;
  subAccounts?: BalanceSheetAccount[];
  isCollapsible?: boolean;
  isExpanded?: boolean;
}

export enum AccountType {
  ACTIVO = 'Activo',
  PASIVO = 'Pasivo',
  CAPITAL = 'Capital'
}

export enum AccountCategory {
  ACTIVO_CORRIENTE = 'Activo Corriente',
  ACTIVO_NO_CORRIENTE = 'Activo No Corriente',
  PASIVO_CORRIENTE = 'Pasivo Corriente',
  PASIVO_NO_CORRIENTE = 'Pasivo No Corriente',
  CAPITAL_SOCIAL = 'Capital Social',
  UTILIDADES_RETENIDAS = 'Utilidades Retenidas'
}

export interface BalanceSheet {
  id: string;
  date: Date;
  title: string;
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  generatedAt: Date;
}

export interface BalanceSheetSection {
  type: AccountType;
  accounts: BalanceSheetAccount[];
  total: number;
  categories: CategoryTotal[];
}

export interface CategoryTotal {
  category: AccountCategory;
  total: number;
  accounts: BalanceSheetAccount[];
}

export interface BalanceSheetFilters {
  date: Date;
  includeZeroBalances: boolean;
  groupByCategory: boolean;
}

export interface BalanceSheetState {
  currentBalance: BalanceSheet | null;
  availableDates: Date[];
  filters: BalanceSheetFilters;
  loading: boolean;
  error: string | null;
}