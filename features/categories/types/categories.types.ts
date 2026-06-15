export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  backgroundColor?: string;
  borderColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
  icon?: string;
}

export type CategoryDialogueMode = 'add' | 'edit';
