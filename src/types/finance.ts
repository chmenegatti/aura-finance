export type { Category } from "./category";
export type { Transaction, TransactionType } from "./transaction";
export type { RecurringExpense, RecurringFrequency } from "./recurringExpense";

export interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
}
