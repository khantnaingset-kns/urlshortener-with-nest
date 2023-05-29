export interface Pagination {
  skip: number;
  take: number;
}

export interface PartialTextSearchQuery {
  text: string;
  pagination: Pagination;
}

export interface FilterByRoleQuery {
  role: string;
  pagination: Pagination;
}
