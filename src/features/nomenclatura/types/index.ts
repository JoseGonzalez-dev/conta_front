export interface Account {
  id: number; // Changed to number as per backend implication (cuenta_padre_id: 1)
  code: string;
  name: string;
  type: AccountType;
  parentId?: number;
  isDetail: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const AccountType = {
  ACTIVO: '1',
  PASIVO: '2',
  PATRIMONIO: '3',
  INGRESO: '4',
  GASTO: '5'
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export interface CreateAccountRequest {
  code: string;
  name: string;
  type: AccountType;
  parentId?: number;
  isDetail: boolean;
  isActive: boolean;
}

export interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}