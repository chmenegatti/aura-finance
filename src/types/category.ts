// Formato vindo do backend (OpenAPI)
export interface CategoryDTO {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  userId: string;
}

// Formato utilizado pela UI (normalizado)
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId?: string;
}
