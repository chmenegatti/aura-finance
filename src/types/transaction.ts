import type { Category, CategoryDTO } from "./category";
import type { ReceiptDTO } from "./receipt";

export type TransactionType = "income" | "expense";

export type TransactionApiType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: Date;
  paymentMethod: string;
  isRecurring?: boolean;
  receiptUrl?: string | null;
  receipt?: ReceiptDTO | null;
  notes?: string;
  attachments?: string[];
}

// Formato vindo do backend (OpenAPI)
export interface TransactionDTO {
  id: string;
  type: TransactionApiType;
  amount: string; // Decimal serialized as string
  description: string;
  date: string;
  categoryId: string;
  paymentMethod: string;
  isRecurring: boolean;
  receiptUrl: string | null;
  recurringExpenseId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category: CategoryDTO;
  receipt: ReceiptDTO | null;
}

export interface TransactionCreateRequest {
  description: string;
  amount: number;
  type: TransactionApiType;
  categoryId: string;
  date: string; // date-time
  paymentMethod: string;
  isRecurring?: boolean;
}

export interface TransactionUpdateRequest {
  description?: string;
  amount?: number;
  type?: TransactionApiType;
  categoryId?: string;
  date?: string; // date-time
  paymentMethod?: string;
  isRecurring?: boolean;
}
