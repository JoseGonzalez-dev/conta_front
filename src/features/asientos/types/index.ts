export interface JournalEntry {
  id: string;
  date: Date;
  time: string;
  description: string;
  movements: Movement[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movement {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  accountBalance: number;
  accountNature: 'Deudora' | 'Acreedora';
  debit: number;
  credit: number;
}

export interface CreateJournalEntryRequest {
  date: Date;
  time: string;
  description: string;
  movements: CreateMovementRequest[];
}

export interface CreateMovementRequest {
  accountId: string;
  debit: number;
  credit: number;
}

export interface JournalEntriesState {
  entries: JournalEntry[];
  currentEntry: Partial<CreateJournalEntryRequest>;
  loading: boolean;
  error: string | null;
}

export interface AccountSummary {
  id: string;
  code: string;
  name: string;
  balance: number;
  nature: 'Deudora' | 'Acreedora';
}