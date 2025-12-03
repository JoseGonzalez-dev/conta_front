export interface ClosingPeriod {
  id: string;
  year: number;
  month: number;
  name: string;
  status: 'open' | 'closed' | 'in_progress';
  startDate: Date;
  endDate: Date;
  closedAt?: Date;
  closedBy?: string;
}

export interface IncomeStatement {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeAccounts: ResultAccount[];
  expenseAccounts: ResultAccount[];
}

export interface ResultAccount {
  id: string;
  code: string;
  name: string;
  type: 'income' | 'expense';
  balance: number;
  movements: AccountMovement[];
}

export interface AccountMovement {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  reference: string;
}

export interface ClosingEntry {
  id: string;
  date: Date;
  description: string;
  movements: ClosingMovement[];
  type: 'income_closing' | 'expense_closing' | 'result_transfer';
}

export interface ClosingMovement {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface ClosingProcess {
  period: ClosingPeriod;
  incomeStatement: IncomeStatement;
  closingEntries: ClosingEntry[];
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
}

export interface ClosingState {
  availablePeriods: ClosingPeriod[];
  selectedPeriod: ClosingPeriod | null;
  closingProcess: ClosingProcess | null;
  loading: boolean;
  error: string | null;
}