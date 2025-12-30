import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type {
  Transaction,
  TransactionDTO,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionApiType,
} from "@/types/transaction";
import { mapTransaction, mapTransactions } from "./mappers";

export interface TransactionListParams {
  page?: number;
  pageSize?: number;
  startDate?: string; // ISO
  endDate?: string; // ISO
  type?: TransactionApiType;
  categoryId?: string;
  isRecurring?: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const transactionService = {
  async listPaginated(params?: TransactionListParams): Promise<Paginated<Transaction>> {
    const { data } = await api.get<
      ApiResponseSuccess<Paginated<TransactionDTO>>
    >("/transactions", { params });

    return {
      ...data.data,
      items: mapTransactions(data.data.items),
    };
  },

  async list(params?: TransactionListParams): Promise<Transaction[]> {
    const result = await this.listPaginated(params);
    return result.items;
  },

  async getById(id: string): Promise<Transaction> {
    const { data } = await api.get<ApiResponseSuccess<TransactionDTO>>(
      `/transactions/${id}`
    );
    return mapTransaction(data.data);
  },

  async create(payload: TransactionCreateRequest): Promise<Transaction> {
    const { data } = await api.post<ApiResponseSuccess<TransactionDTO>>(
      "/transactions",
      payload
    );
    return mapTransaction(data.data);
  },

  async update(id: string, payload: TransactionUpdateRequest): Promise<Transaction> {
    const { data } = await api.put<ApiResponseSuccess<TransactionDTO>>(
      `/transactions/${id}`,
      payload
    );
    return mapTransaction(data.data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
