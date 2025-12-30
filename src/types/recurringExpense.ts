import type { Category } from "./category";

// UI
export type RecurringFrequency = "monthly" | "yearly" | "custom";

export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  frequency: RecurringFrequency;
  dueDay: number;
  totalInstallments: number;
  currentInstallment: number;
  isActive: boolean;
}

// Backend (OpenAPI)
export type RecurringFrequencyApi = "MONTHLY" | "YEARLY" | "CUSTOM";
export type RecurringExpenseTypeApi = "FINANCING" | "LOAN" | "SUBSCRIPTION" | "OTHER";

export interface RecurringExpenseDTO {
  id: string;
  description: string;
  amount: string; // Decimal serialized as string
  startDate: string;
  endDate: string | null;
  frequency: RecurringFrequencyApi;
  customIntervalDays: number | null;
  totalInstallments: number;
  currentInstallment: number;
  type: RecurringExpenseTypeApi;
  lastGeneratedAt: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringExpenseCreateRequest {
  description: string;
  amount: number;
  startDate: string;
  endDate?: string | null;
  frequency: RecurringFrequencyApi;
  customIntervalDays?: number | null;
  totalInstallments: number;
  currentInstallment?: number | null;
  type: RecurringExpenseTypeApi;
}

export interface RecurringExpenseUpdateRequest {
  description?: string;
  amount?: number;
  startDate?: string;
  endDate?: string | null;
  frequency?: RecurringFrequencyApi;
  customIntervalDays?: number | null;
  totalInstallments?: number;
  currentInstallment?: number;
  type?: RecurringExpenseTypeApi;
}
