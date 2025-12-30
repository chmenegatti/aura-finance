import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type { Category, CategoryDTO } from "@/types/category";
import { mapCategory } from "./mappers";

export interface CategoryCreateRequest {
  name: string;
  icon?: string | null;
  color?: string | null;
}

export interface CategoryUpdateRequest {
  name?: string;
  icon?: string | null;
  color?: string | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const categoryService = {
  async listPaginated(params?: { page?: number; pageSize?: number }): Promise<Paginated<Category>> {
    const { data } = await api.get<ApiResponseSuccess<Paginated<CategoryDTO>>>(
      "/categories",
      { params }
    );

    return {
      ...data.data,
      items: data.data.items.map(mapCategory),
    };
  },

  async list(): Promise<Category[]> {
    const { items } = await this.listPaginated({ page: 1, pageSize: 100 });
    return items;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<ApiResponseSuccess<CategoryDTO>>(
      `/categories/${id}`
    );
    return mapCategory(data.data);
  },

  async create(payload: CategoryCreateRequest): Promise<Category> {
    const { data } = await api.post<ApiResponseSuccess<CategoryDTO>>(
      "/categories",
      payload
    );
    return mapCategory(data.data);
  },

  async update(id: string, payload: CategoryUpdateRequest): Promise<Category> {
    const { data } = await api.put<ApiResponseSuccess<CategoryDTO>>(
      `/categories/${id}`,
      payload
    );
    return mapCategory(data.data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
