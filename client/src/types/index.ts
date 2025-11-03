export interface Template {
  id: string;
  name: string;
  description: string;
  author: string;
  license: string;
  price: number;
  keywords: string[];
  thumbnail: string;
  editableBlocks: EditableBlock[];
}

export interface EditableBlock {
  id: string;
  type: 'text' | 'image';
  label: string;
  defaultValue: string;
  required: boolean;
}

export interface Landing {
  id: string;
  templateId: string;
  name: string;
  createdAt: string;
  blocks: LandingBlock[];
}

export interface LandingBlock {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

export interface SearchFilters {
  name: string;
  keywords: string;
}

export interface ApiError {
  message: string;
  code?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}