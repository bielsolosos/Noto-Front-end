export interface PageableObject {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageResponsePagination<T> {
  content: T[];
  pageable: PageableObject;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
